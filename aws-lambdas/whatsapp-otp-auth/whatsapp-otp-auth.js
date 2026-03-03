// ============================================
// PRODUCTION WHATSAPP OTP LAMBDA
// With Anti-Abuse Protection
// ============================================

const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Configuration from environment variables
const CONFIG = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  },
  botPenguin: {
    apiUrl: process.env.BOT_PENGUIN_API_URL,
    apiKey: process.env.BOT_PENGUIN_API_KEY,
    templateId: process.env.BOT_PENGUIN_TEMPLATE_ID,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  rateLimit: {
    maxOtpPerHour: parseInt(process.env.MAX_OTP_PER_HOUR) || 3,
    maxOtpPerDay: parseInt(process.env.MAX_OTP_PER_DAY) || 10,
    cooldownSeconds: parseInt(process.env.OTP_COOLDOWN_SECONDS) || 60,
    maxVerifyAttempts: parseInt(process.env.MAX_VERIFY_ATTEMPTS) || 5,
    blockDurationHours: parseInt(process.env.BLOCK_DURATION_HOURS) || 24,
  },
};

// Database connection
async function getDBConnection() {
  return await mysql.createConnection(CONFIG.db);
}

// Rate limiting check
async function checkRateLimit(connection, mobile, ipAddress) {
  const now = new Date();

  // Check if blocked
  const [blocked] = await connection.execute(
    "SELECT * FROM otp_rate_limits WHERE mobile = ? AND blocked_until > NOW()",
    [mobile],
  );

  if (blocked.length > 0) {
    const unblockTime = new Date(blocked[0].blocked_until);
    const minutesLeft = Math.ceil((unblockTime - now) / 60000);
    return {
      allowed: false,
      reason: `Too many attempts. Try again in ${minutesLeft} minutes.`,
    };
  }

  // Get or create rate limit record
  let [records] = await connection.execute(
    "SELECT * FROM otp_rate_limits WHERE mobile = ?",
    [mobile],
  );

  if (records.length === 0) {
    await connection.execute(
      "INSERT INTO otp_rate_limits (mobile, ip_address, request_count, last_request_at, created_at) VALUES (?, ?, 1, NOW(), NOW())",
      [mobile, ipAddress],
    );
    return { allowed: true };
  }

  const record = records[0];
  const lastRequest = new Date(record.last_request_at);
  const secondsSinceLastRequest = (now - lastRequest) / 1000;

  // Check cooldown
  if (secondsSinceLastRequest < CONFIG.rateLimit.cooldownSeconds) {
    const waitSeconds = Math.ceil(
      CONFIG.rateLimit.cooldownSeconds - secondsSinceLastRequest,
    );
    return {
      allowed: false,
      reason: `Please wait ${waitSeconds} seconds before requesting another OTP.`,
    };
  }

  // Count hourly requests
  const hourAgo = new Date(now - 60 * 60 * 1000);
  const [hourCount] = await connection.execute(
    "SELECT COUNT(*) as count FROM otp_verifications WHERE mobile = ? AND created_at > ?",
    [mobile, hourAgo],
  );

  if (hourCount[0].count >= CONFIG.rateLimit.maxOtpPerHour) {
    await connection.execute(
      "UPDATE otp_rate_limits SET blocked_until = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE mobile = ?",
      [mobile],
    );
    return {
      allowed: false,
      reason: `Maximum ${CONFIG.rateLimit.maxOtpPerHour} OTP requests per hour exceeded.`,
    };
  }

  // Count daily requests
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const [dayCount] = await connection.execute(
    "SELECT COUNT(*) as count FROM otp_verifications WHERE mobile = ? AND created_at > ?",
    [mobile, dayAgo],
  );

  if (dayCount[0].count >= CONFIG.rateLimit.maxOtpPerDay) {
    await connection.execute(
      "UPDATE otp_rate_limits SET blocked_until = DATE_ADD(NOW(), INTERVAL ? HOUR) WHERE mobile = ?",
      [CONFIG.rateLimit.blockDurationHours, mobile],
    );
    return {
      allowed: false,
      reason: `Maximum ${CONFIG.rateLimit.maxOtpPerDay} OTP requests per day exceeded.`,
    };
  }

  // Update rate limit
  await connection.execute(
    "UPDATE otp_rate_limits SET request_count = request_count + 1, last_request_at = NOW(), ip_address = ? WHERE mobile = ?",
    [ipAddress, mobile],
  );

  return { allowed: true };
}

// Send WhatsApp message via Bot Penguin
async function sendWhatsAppMessage(mobile, otp) {
  try {
    const formattedMobile = mobile.replace("+", "");

    const response = await axios.post(
      `${CONFIG.botPenguin.apiUrl}/whatsapp-automation/wa/send-template?apiKey=${CONFIG.botPenguin.apiKey}`,
      {
        wa_id: formattedMobile,
        templateId: CONFIG.botPenguin.templateId,
        params: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: otp,
              },
            ],
          },
        ],
      },
      {
        headers: {
          apiKey: CONFIG.botPenguin.apiKey,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    console.log("WhatsApp message sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Bot Penguin error:", error.response?.data || error.message);
    throw new Error("Failed to send WhatsApp message");
  }
}

// Send OTP
async function sendOTP(mobile, ipAddress, bypass = false) {
  const connection = await getDBConnection();

  try {
    // Validate mobile
    if (!mobile.match(/^\+\d{10,15}$/)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Invalid mobile number. Use: +919876543210",
        }),
      };
    }

    // Check rate limit
    const rateLimitCheck = await checkRateLimit(connection, mobile, ipAddress);
    if (!rateLimitCheck.allowed) {
      return {
        statusCode: 429,
        body: JSON.stringify({
          success: false,
          error: rateLimitCheck.reason,
        }),
      };
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete old OTPs
    await connection.execute(
      "DELETE FROM otp_verifications WHERE mobile = ? AND verified = 0",
      [mobile],
    );

    // Store OTP (SIDE EFFECT - must execute)
    await connection.execute(
      "INSERT INTO otp_verifications (mobile, otp, created_at, expires_at, ip_address) VALUES (?, ?, NOW(), ?, ?)",
      [mobile, otp, expiresAt, ipAddress],
    );

    // Try to send via WhatsApp
    let whatsappError = null;
    try {
      await sendWhatsAppMessage(mobile, otp);
    } catch (error) {
      console.error("WhatsApp send failed:", error.message);
      whatsappError = error;

      // If not in bypass mode, fail the request
      if (!bypass) {
        throw error;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message:
          bypass && whatsappError
            ? "OTP generated. WhatsApp delivery failed but you can still verify with OTP (check SMS or contact support)"
            : "OTP sent to your WhatsApp",
        expiresIn: 300,
        bypass: bypass && whatsappError ? true : false,
        otp: bypass && whatsappError ? otp : undefined, // Only show OTP in bypass mode if WhatsApp failed
      }),
    };
  } catch (error) {
    console.error("Send OTP error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Failed to send OTP",
      }),
    };
  } finally {
    await connection.end();
  }
}

// Verify OTP
async function verifyOTP(mobile, otp, ipAddress, bypass = false) {
  const connection = await getDBConnection();

  try {
    // Find OTP
    const [otpRecords] = await connection.execute(
      "SELECT * FROM otp_verifications WHERE mobile = ? AND otp = ? AND verified = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [mobile, otp],
    );

    if (otpRecords.length === 0) {
      // Increment attempts (SIDE EFFECT - must execute)
      await connection.execute(
        "UPDATE otp_verifications SET attempts = attempts + 1 WHERE mobile = ? AND verified = 0",
        [mobile],
      );

      // Check failed attempts
      const [failedAttempts] = await connection.execute(
        "SELECT SUM(attempts) as total FROM otp_verifications WHERE mobile = ? AND verified = 0 AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)",
        [mobile],
      );

      if (failedAttempts[0].total >= CONFIG.rateLimit.maxVerifyAttempts) {
        // Block user (SIDE EFFECT - must execute)
        await connection.execute(
          "INSERT INTO otp_rate_limits (mobile, ip_address, blocked_until, created_at, last_request_at, request_count) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR), NOW(), NOW(), 0) ON DUPLICATE KEY UPDATE blocked_until = DATE_ADD(NOW(), INTERVAL ? HOUR)",
          [
            mobile,
            ipAddress,
            CONFIG.rateLimit.blockDurationHours,
            CONFIG.rateLimit.blockDurationHours,
          ],
        );

        return {
          statusCode: 429,
          body: JSON.stringify({
            success: false,
            error: `Too many failed attempts. Blocked for ${CONFIG.rateLimit.blockDurationHours} hours.`,
          }),
        };
      }

      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Invalid or expired OTP",
        }),
      };
    }

    // Mark verified (SIDE EFFECT - must execute)
    await connection.execute(
      "UPDATE otp_verifications SET verified = 1 WHERE id = ?",
      [otpRecords[0].id],
    );

    // Reset rate limit (SIDE EFFECT - must execute)
    await connection.execute("DELETE FROM otp_rate_limits WHERE mobile = ?", [
      mobile,
    ]);

    // Find or create customer (SIDE EFFECT - must execute)
    const customer = await findOrCreateCustomer(connection, mobile);

    // Generate JWT
    const token = jwt.sign(
      {
        customer_id: customer.customer_id,
        mobile: mobile,
        email: customer.email,
      },
      CONFIG.jwt.secret,
      { expiresIn: "30d" },
    );

    console.log(
      `OTP verified for ${mobile}, customer_id: ${customer.customer_id}`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "OTP verified",
        token: token,
        customer: customer,
      }),
    };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Verification failed",
      }),
    };
  } finally {
    await connection.end();
  }
}

// Find or create customer
async function findOrCreateCustomer(connection, mobile) {
  const [customers] = await connection.execute(
    "SELECT customer_id, firstname, lastname, email, telephone FROM oc_customer WHERE telephone = ? LIMIT 1",
    [mobile],
  );

  if (customers.length > 0) {
    return customers[0];
  }

  const cleanMobile = mobile.replace(/[^0-9]/g, "");
  const email = `${cleanMobile}@whatsapp.customer`;

  const [result] = await connection.execute(
    "INSERT INTO oc_customer (customer_group_id, store_id, language_id, firstname, lastname, email, telephone, status, safe, date_added) VALUES (1, 0, 1, ?, ?, ?, ?, 1, 1, NOW())",
    ["John", "Doe", email, mobile],
  );

  return {
    customer_id: result.insertId,
    firstname: "John",
    lastname: "Doe",
    email: email,
    telephone: mobile,
  };
}

// Get current user
async function getCurrentUser(token) {
  try {
    const decoded = jwt.verify(token, CONFIG.jwt.secret);
    const connection = await getDBConnection();

    const [customers] = await connection.execute(
      "SELECT customer_id, firstname, lastname, email, telephone FROM oc_customer WHERE customer_id = ?",
      [decoded.customer_id],
    );

    await connection.end();

    if (customers.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Customer not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ customer: customers[0] }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Invalid token" }),
    };
  }
}

// Lambda handler
exports.handler = async (event) => {
  const pathWithBase =
    event.path || event.rawPath || event.requestContext?.http?.path;

  // Strip api/auth/ prefix to get the endpoint
  const path = pathWithBase.replace(/^\/?api\/?auth\/?/, "/") || "/";

  const method = event.httpMethod || event.requestContext?.http?.method;
  const body = event.body ? JSON.parse(event.body) : {};
  const headers = event.headers || {};
  const queryParams = event.queryStringParameters || {};

  const ipAddress =
    event.requestContext?.http?.sourceIp ||
    event.requestContext?.identity?.sourceIp ||
    headers["x-forwarded-for"]?.split(",")[0] ||
    "unknown";

  // Check for bypass flag in query params or body
  const bypass = queryParams.bypass === "true" || body.bypass === true;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Max-Age": "86400",
  };

  if (method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    let response;

    if (path === "/send-otp" && method === "POST") {
      response = await sendOTP(body.mobile, ipAddress, bypass);
    } else if (path === "/verify-otp" && method === "POST") {
      response = await verifyOTP(body.mobile, body.otp, ipAddress, bypass);
    } else if (path === "/me" && method === "GET") {
      const token = headers.authorization?.replace("Bearer ", "");
      response = await getCurrentUser(token);
    } else {
      response = {
        statusCode: 404,
        body: JSON.stringify({ error: "Not found" }),
      };
    }

    return {
      ...response,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Lambda error:", error.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal error" }),
    };
  }
};
