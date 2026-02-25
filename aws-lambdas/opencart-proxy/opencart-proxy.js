// ============================================
// COMPLETE OPENCART API WRAPPER LAMBDA
// Production Ready with Public & Authenticated Routes
// ============================================

const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Configuration
const CONFIG = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  },
  opencart: {
    url: process.env.OPENCART_URL,
    apiUsername: process.env.OPENCART_API_USERNAME,
    apiKey: process.env.OPENCART_API_KEY,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

async function getDBConnection() {
  console.log("[DB] Creating DB connection", {
    host: CONFIG.db.host,
    database: CONFIG.db.database,
    port: CONFIG.db.port,
  });
  try {
    const connection = await mysql.createConnection(CONFIG.db);
    console.log("[DB] Connection established successfully");
    return connection;
  } catch (error) {
    console.error("[DB] Failed to create connection:", error.message);
    throw error;
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

// Get or create authenticated OpenCart session for customer
async function getAuthenticatedSession(connection, customerId) {
  console.log(
    `[AUTH_SESSION] Checking for existing session for customer ${customerId}`,
  );
  try {
    // Check for recent session (< 20 minutes old)
    const [sessions] = await connection.execute(
      `SELECT * FROM opencart_sessions 
       WHERE customer_id = ? 
       AND last_activity > DATE_SUB(NOW(), INTERVAL 20 MINUTE)
       ORDER BY created_at DESC 
       LIMIT 1`,
      [customerId],
    );

    console.log(
      `[AUTH_SESSION] Found ${sessions.length} existing sessions for customer ${customerId}`,
    );
    if (sessions.length > 0) {
      console.log(
        `[AUTH_SESSION] Updating last_activity for session ID: ${sessions[0].id}`,
      );
      await connection.execute(
        "UPDATE opencart_sessions SET last_activity = NOW() WHERE id = ?",
        [sessions[0].id],
      );

      console.log(
        `[AUTH_SESSION] Reusing authenticated session for customer ${customerId}`,
      );
      return {
        api_token: sessions[0].opencart_api_token,
        session_id: sessions[0].opencart_session_id,
      };
    }

    // Create new authenticated session
    console.log(
      `[AUTH_SESSION] No valid session found. Creating new authenticated session for customer ${customerId}`,
    );
    const session = await createAuthenticatedSession(customerId);

    console.log(
      `[AUTH_SESSION] Storing new session in database for customer ${customerId}`,
    );
    await connection.execute(
      `INSERT INTO opencart_sessions 
       (customer_id, opencart_api_token, opencart_session_id, created_at, last_activity) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [customerId, session.api_token, session.session_id],
    );

    console.log(
      `[AUTH_SESSION] Session stored successfully for customer ${customerId}`,
    );
    return session;
  } catch (error) {
    console.error(
      `[AUTH_SESSION] Error getting authenticated session for customer ${customerId}:`,
      error.message,
    );
    throw error;
  }
}

// Create authenticated OpenCart session with customer_id set
async function createAuthenticatedSession(customerId) {
  try {
    console.log(
      `[CREATE_AUTH_SESSION] Starting authentication for customer ${customerId}`,
    );
    console.log(`[CREATE_AUTH_SESSION] OpenCart URL: ${CONFIG.opencart.url}`);

    // Step 1: Login to OpenCart API
    console.log(`[CREATE_AUTH_SESSION] Step 1: Logging in to OpenCart API`);
    const loginResponse = await axios.post(
      `${CONFIG.opencart.url}/index.php?route=api/account/login`,
      new URLSearchParams({
        username: CONFIG.opencart.apiUsername,
        key: CONFIG.opencart.apiKey,
      }),
    );

    console.log(`[CREATE_AUTH_SESSION] Login response received`);
    const apiToken = loginResponse.data.api_token;
    console.log(
      `[CREATE_AUTH_SESSION] API Token obtained: ${apiToken ? "Success" : "Failed"}`,
    );
    const sessionCookie = loginResponse.headers["set-cookie"]?.[0];
    const sessionId = sessionCookie?.match(/OCSESSID=([^;]+)/)?.[1];
    console.log(
      `[CREATE_AUTH_SESSION] Session ID obtained: ${sessionId ? "Success" : "Failed"}`,
    );

    // Step 2: Set customer in session
    console.log(
      `[CREATE_AUTH_SESSION] Step 2: Setting customer ID ${customerId} in session`,
    );
    const setCustomerResponse = await axios.post(
      `${CONFIG.opencart.url}/index.php?route=api/sale/customer&api_token=${apiToken}`,
      new URLSearchParams({ customer_id: customerId.toString() }),
    );
    console.log(`[CREATE_AUTH_SESSION] Customer set in session successfully`);

    console.log(
      `[CREATE_AUTH_SESSION] Authenticated session created successfully for customer ${customerId}`,
    );
    return { api_token: apiToken, session_id: sessionId };
  } catch (error) {
    console.error(
      `[CREATE_AUTH_SESSION] Failed to create authenticated session for customer ${customerId}:`,
      {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      },
    );
    throw new Error(`Failed to create OpenCart session: ${error.message}`);
  }
}

// Get public OpenCart API session (no customer)
async function getPublicSession(connection) {
  console.log("[PUBLIC_SESSION] Checking for existing public session");
  try {
    // Check for recent public session (< 20 minutes old)
    const [sessions] = await connection.execute(
      `SELECT * FROM opencart_public_sessions 
       WHERE last_activity > DATE_SUB(NOW(), INTERVAL 20 MINUTE)
       ORDER BY created_at DESC 
       LIMIT 1`,
    );

    console.log(
      `[PUBLIC_SESSION] Found ${sessions.length} existing public session(s)`,
    );

    if (sessions.length > 0) {
      console.log(
        `[PUBLIC_SESSION] Updating last_activity for session ID: ${sessions[0].id}`,
      );
      await connection.execute(
        "UPDATE opencart_public_sessions SET last_activity = NOW() WHERE id = ?",
        [sessions[0].id],
      );

      console.log("[PUBLIC_SESSION] Reusing existing public session");
      return {
        api_token: sessions[0].opencart_api_token,
        session_id: sessions[0].opencart_session_id,
      };
    }

    // Create new public session
    console.log(
      "[PUBLIC_SESSION] No valid session found. Creating new public session",
    );
    const session = await createPublicSession();

    console.log("[PUBLIC_SESSION] Storing new public session in database");
    await connection.execute(
      `INSERT INTO opencart_public_sessions 
       (opencart_api_token, opencart_session_id, created_at, last_activity) 
       VALUES (?, ?, NOW(), NOW())`,
      [session.api_token, session.session_id],
    );

    console.log("[PUBLIC_SESSION] Public session stored successfully");
    return session;
  } catch (error) {
    console.error(
      "[PUBLIC_SESSION] Error getting public session:",
      error.message,
    );
    throw error;
  }
}

// Create public OpenCart session (no customer)
async function createPublicSession() {
  console.log("[CREATE_PUBLIC_SESSION] Starting public session creation");
  try {
    console.log(
      `[CREATE_PUBLIC_SESSION] Logging in to OpenCart API at ${CONFIG.opencart.url}`,
    );
    const loginResponse = await axios.post(
      `${CONFIG.opencart.url}/index.php?route=api/account/login`,
      new URLSearchParams({
        username: CONFIG.opencart.apiUsername,
        key: CONFIG.opencart.apiKey,
      }),
    );

    console.log("[CREATE_PUBLIC_SESSION] Login successful");
    const apiToken = loginResponse.data.api_token;
    console.log(
      `[CREATE_PUBLIC_SESSION] API Token obtained: ${apiToken ? "Success" : "Failed"}`,
    );
    const sessionCookie = loginResponse.headers["set-cookie"]?.[0];
    const sessionId = sessionCookie?.match(/OCSESSID=([^;]+)/)?.[1];
    console.log(
      `[CREATE_PUBLIC_SESSION] Session ID obtained: ${sessionId ? "Success" : "Failed"}`,
    );

    console.log("[CREATE_PUBLIC_SESSION] Public session created successfully");
    return { api_token: apiToken, session_id: sessionId };
  } catch (error) {
    console.error("[CREATE_PUBLIC_SESSION] Failed to create public session:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(`Failed to create public session: ${error.message}`);
  }
}

// ============================================
// OPENCART API CALLER
// ============================================

async function callOpenCartAPI(connection, route, options = {}) {
  const {
    method = "GET",
    data = {},
    queryParams = {},
    customerId = null,
    requiresAuth = false,
  } = options;

  console.log("[API_CALL] Starting API call", {
    route,
    method,
    requiresAuth,
    customerId,
    queryParams,
  });

  // Get appropriate session
  let session;

  try {
    console.log(
      "[API_CALL] Getting session for route:",
      route,
      "| requiresAuth:",
      requiresAuth,
    );
    if (requiresAuth && customerId) {
      console.log(
        `[API_CALL] Fetching authenticated session for customer ${customerId}`,
      );
      session = await getAuthenticatedSession(connection, customerId);
    } else {
      console.log("[API_CALL] Fetching public session");
      session = await getPublicSession(connection);
    }

    console.log("[API_CALL] Session obtained successfully");

    // Build URL with query parameters
    const params = new URLSearchParams({
      ...queryParams,
    });
    const url = `${CONFIG.opencart.url}/index.php?route=${route}&${params.toString()}`;

    console.log("[API_CALL] Making request", {
      method,
      url,
      data: method !== "GET" ? new URLSearchParams(data) : undefined,
      headers: {
        Cookie: `OCSESSID=${session.session_id}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    try {
      const response = await axios({
        method,
        url,
        data: method !== "GET" ? new URLSearchParams(data) : undefined,
        headers: {
          Cookie: `OCSESSID=${session.session_id}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("[API_CALL] API request successful for route:", route);
      return response.data;
    } catch (error) {
      console.error("[API_CALL] API request failed for route:", route, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        error: error.response?.data?.error,
        message: error.message,
      });

      // Handle session expiry
      if (
        error.response?.status === 401 ||
        error.response?.data?.error?.includes("permission")
      ) {
        console.log(
          "[API_CALL] Session expired (401 or permission error), re-authenticating...",
        );

        // Delete expired session
        if (requiresAuth && customerId) {
          console.log(
            `[API_CALL] Deleting expired authenticated session for customer ${customerId}`,
          );
          await connection.execute(
            "DELETE FROM opencart_sessions WHERE customer_id = ?",
            [customerId],
          );
          console.log(
            `[API_CALL] Creating new authenticated session for customer ${customerId}`,
          );
          session = await createAuthenticatedSession(customerId);
          await connection.execute(
            `INSERT INTO opencart_sessions 
             (customer_id, opencart_api_token, opencart_session_id, created_at, last_activity) 
             VALUES (?, ?, ?, NOW(), NOW())`,
            [customerId, session.api_token, session.session_id],
          );
          console.log(
            `[API_CALL] New authenticated session created and stored for customer ${customerId}`,
          );
        } else {
          console.log("[API_CALL] Deleting expired public session");
          await connection.execute(
            "DELETE FROM opencart_public_sessions WHERE id = ?",
            [session.id],
          );
          console.log("[API_CALL] Creating new public session");
          session = await createPublicSession();
          await connection.execute(
            `INSERT INTO opencart_public_sessions 
             (opencart_api_token, opencart_session_id, created_at, last_activity) 
             VALUES (?, ?, NOW(), NOW())`,
            [session.api_token, session.session_id],
          );
          console.log("[API_CALL] New public session created and stored");
        }

        // Retry with new session
        console.log(
          "[API_CALL] Retrying API request with new session for route:",
          route,
        );
        const retryParams = new URLSearchParams({
          ...queryParams,
        });
        const retryUrl = `${CONFIG.opencart.url}/index.php?route=${route}&${retryParams.toString()}`;

        const retryResponse = await axios({
          method,
          url: retryUrl,
          data: method !== "GET" ? new URLSearchParams(data) : undefined,
          headers: {
            Cookie: `OCSESSID=${session.session_id}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        console.log(
          "[API_CALL] Retry API request successful for route:",
          route,
        );
        return retryResponse.data;
      }

      throw error;
    }
  } catch (error) {
    console.error("[API_CALL] Error in callOpenCartAPI for route:", route, {
      status: error.response?.status,
      message: error.message,
    });
    throw error;
  }
}

// ============================================
// PUBLIC API ENDPOINTS (No Auth Required)
// ============================================

async function getProducts(queryParams) {
  console.log(
    "[GET_PRODUCTS] Fetching products with query params:",
    queryParams,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_PRODUCTS] DB connection established");
    console.log("[GET_PRODUCTS] Calling OpenCart API for products");
    const result = await callOpenCartAPI(connection, "api/catalog/product", {
      method: "GET",
      queryParams,
      requiresAuth: false,
    });
    console.log("[GET_PRODUCTS] Successfully retrieved products");
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error("[GET_PRODUCTS] Error fetching products:", error.message);
    throw error;
  } finally {
    console.log("[GET_PRODUCTS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[GET_PRODUCTS] Error closing connection:", err.message),
      );
  }
}

async function getProduct(productId) {
  console.log("[GET_PRODUCT] Fetching product ID:", productId);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_PRODUCT] DB connection established");
    const result = await callOpenCartAPI(connection, "api/catalog/product", {
      method: "GET",
      queryParams: { product_id: productId },
      requiresAuth: false,
    });
    console.log("[GET_PRODUCT] Successfully retrieved product", productId);
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[GET_PRODUCT] Error fetching product",
      productId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_PRODUCT] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[GET_PRODUCT] Error closing connection:", err.message),
      );
  }
}

async function searchProducts(queryParams) {
  console.log("[SEARCH_PRODUCTS] Searching products with params:", queryParams);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[SEARCH_PRODUCTS] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/catalog/product|search",
      {
        method: "GET",
        queryParams,
        requiresAuth: false,
      },
    );
    console.log("[SEARCH_PRODUCTS] Successfully searched products");
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error("[SEARCH_PRODUCTS] Error searching products:", error.message);
    throw error;
  } finally {
    console.log("[SEARCH_PRODUCTS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[SEARCH_PRODUCTS] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function getCategories(queryParams) {
  console.log("[GET_CATEGORIES] Fetching categories with params:", queryParams);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_CATEGORIES] DB connection established");
    const result = await callOpenCartAPI(connection, "api/catalog/category", {
      method: "GET",
      queryParams,
      requiresAuth: false,
    });
    console.log("[GET_CATEGORIES] Successfully retrieved categories");
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error("[GET_CATEGORIES] Error fetching categories:", error.message);
    throw error;
  } finally {
    console.log("[GET_CATEGORIES] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[GET_CATEGORIES] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function getCategory(categoryId) {
  console.log("[GET_CATEGORY] Fetching category ID:", categoryId);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_CATEGORY] DB connection established");
    const result = await callOpenCartAPI(connection, "api/catalog/category", {
      method: "GET",
      queryParams: { category_id: categoryId },
      requiresAuth: false,
    });
    console.log("[GET_CATEGORY] Successfully retrieved category", categoryId);
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[GET_CATEGORY] Error fetching category",
      categoryId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_CATEGORY] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[GET_CATEGORY] Error closing connection:", err.message),
      );
  }
}

async function getCategoryProducts(categoryId, queryParams) {
  console.log(
    "[GET_CATEGORY_PRODUCTS] Fetching products for category ID:",
    categoryId,
    "with params:",
    queryParams,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_CATEGORY_PRODUCTS] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/catalog/category|products",
      {
        method: "GET",
        queryParams: { category_id: categoryId, ...queryParams },
        requiresAuth: false,
      },
    );
    console.log(
      "[GET_CATEGORY_PRODUCTS] Successfully retrieved products for category",
      categoryId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[GET_CATEGORY_PRODUCTS] Error fetching category products",
      categoryId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_CATEGORY_PRODUCTS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[GET_CATEGORY_PRODUCTS] Error closing connection:",
          err.message,
        ),
      );
  }
}

// ============================================
// AUTHENTICATED API ENDPOINTS (Require Auth)
// ============================================

async function addToCart(customerId, data) {
  console.log(
    "[ADD_TO_CART] Adding to cart for customer:",
    customerId,
    "data:",
    data,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[ADD_TO_CART] DB connection established");
    const result = await callOpenCartAPI(connection, "api/sale/cart", {
      method: "POST",
      data,
      customerId,
      requiresAuth: true,
    });
    console.log(
      "[ADD_TO_CART] Successfully added to cart for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[ADD_TO_CART] Error adding to cart for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[ADD_TO_CART] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[ADD_TO_CART] Error closing connection:", err.message),
      );
  }
}

async function getCart(customerId) {
  console.log("[GET_CART] Fetching cart for customer:", customerId);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_CART] DB connection established");
    const result = await callOpenCartAPI(connection, "api/sale/cart", {
      method: "GET",
      customerId,
      requiresAuth: true,
    });
    console.log(
      "[GET_CART] Successfully retrieved cart for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[GET_CART] Error fetching cart for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_CART] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[GET_CART] Error closing connection:", err.message),
      );
  }
}

async function removeFromCart(customerId, key) {
  console.log(
    "[REMOVE_FROM_CART] Removing item from cart for customer:",
    customerId,
    "key:",
    key,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[REMOVE_FROM_CART] DB connection established");
    const result = await callOpenCartAPI(connection, "api/sale/cart", {
      method: "POST",
      data: { key, quantity: 0 },
      customerId,
      requiresAuth: true,
    });
    console.log(
      "[REMOVE_FROM_CART] Successfully removed from cart for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[REMOVE_FROM_CART] Error removing from cart for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[REMOVE_FROM_CART] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[REMOVE_FROM_CART] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function setShippingAddress(customerId, address) {
  console.log(
    "[SET_SHIPPING_ADDRESS] Setting shipping address for customer:",
    customerId,
    "address:",
    address,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[SET_SHIPPING_ADDRESS] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/sale/shipping_address",
      {
        method: "POST",
        data: address,
        customerId,
        requiresAuth: true,
      },
    );
    console.log(
      "[SET_SHIPPING_ADDRESS] Successfully set shipping address for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[SET_SHIPPING_ADDRESS] Error setting shipping address for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[SET_SHIPPING_ADDRESS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[SET_SHIPPING_ADDRESS] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function setPaymentAddress(customerId, address) {
  console.log(
    "[SET_PAYMENT_ADDRESS] Setting payment address for customer:",
    customerId,
    "address:",
    address,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[SET_PAYMENT_ADDRESS] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/sale/payment_address",
      {
        method: "POST",
        data: address,
        customerId,
        requiresAuth: true,
      },
    );
    console.log(
      "[SET_PAYMENT_ADDRESS] Successfully set payment address for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[SET_PAYMENT_ADDRESS] Error setting payment address for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[SET_PAYMENT_ADDRESS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[SET_PAYMENT_ADDRESS] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function getShippingMethods(customerId) {
  console.log(
    "[GET_SHIPPING_METHODS] Fetching shipping methods for customer:",
    customerId,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_SHIPPING_METHODS] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/sale/shipping_method",
      {
        method: "GET",
        customerId,
        requiresAuth: true,
      },
    );
    console.log(
      "[GET_SHIPPING_METHODS] Successfully retrieved shipping methods for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[GET_SHIPPING_METHODS] Error fetching shipping methods for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_SHIPPING_METHODS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[GET_SHIPPING_METHODS] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function setShippingMethod(customerId, method) {
  console.log(
    "[SET_SHIPPING_METHOD] Setting shipping method for customer:",
    customerId,
    "method:",
    method,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[SET_SHIPPING_METHOD] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/sale/shipping_method",
      {
        method: "POST",
        data: { shipping_method: method },
        customerId,
        requiresAuth: true,
      },
    );
    console.log(
      "[SET_SHIPPING_METHOD] Successfully set shipping method for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[SET_SHIPPING_METHOD] Error setting shipping method for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[SET_SHIPPING_METHOD] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[SET_SHIPPING_METHOD] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function getPaymentMethods(customerId) {
  console.log(
    "[GET_PAYMENT_METHODS] Fetching payment methods for customer:",
    customerId,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_PAYMENT_METHODS] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/sale/payment_method",
      {
        method: "GET",
        customerId,
        requiresAuth: true,
      },
    );
    console.log(
      "[GET_PAYMENT_METHODS] Successfully retrieved payment methods for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[GET_PAYMENT_METHODS] Error fetching payment methods for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_PAYMENT_METHODS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[GET_PAYMENT_METHODS] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function setPaymentMethod(customerId, method) {
  console.log(
    "[SET_PAYMENT_METHOD] Setting payment method for customer:",
    customerId,
    "method:",
    method,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[SET_PAYMENT_METHOD] DB connection established");
    const result = await callOpenCartAPI(
      connection,
      "api/sale/payment_method",
      {
        method: "POST",
        data: { payment_method: method },
        customerId,
        requiresAuth: true,
      },
    );
    console.log(
      "[SET_PAYMENT_METHOD] Successfully set payment method for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[SET_PAYMENT_METHOD] Error setting payment method for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[SET_PAYMENT_METHOD] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[SET_PAYMENT_METHOD] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function createOrder(customerId) {
  console.log("[CREATE_ORDER] Creating order for customer:", customerId);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[CREATE_ORDER] DB connection established");
    const result = await callOpenCartAPI(connection, "api/sale/order", {
      method: "POST",
      customerId,
      requiresAuth: true,
    });
    console.log(
      "[CREATE_ORDER] Successfully created order for customer:",
      customerId,
    );
    return { statusCode: 200, body: result };
  } catch (error) {
    console.error(
      "[CREATE_ORDER] Error creating order for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[CREATE_ORDER] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[CREATE_ORDER] Error closing connection:", err.message),
      );
  }
}

async function getCustomerOrders(customerId) {
  console.log(
    "[GET_CUSTOMER_ORDERS] Fetching orders for customer:",
    customerId,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_CUSTOMER_ORDERS] DB connection established");
    const [orders] = await connection.execute(
      "SELECT * FROM oc_order WHERE customer_id = ? ORDER BY date_added DESC",
      [customerId],
    );
    console.log(
      "[GET_CUSTOMER_ORDERS] Retrieved",
      orders.length,
      "orders for customer:",
      customerId,
    );
    return { statusCode: 200, body: JSON.stringify({ orders }) };
  } catch (error) {
    console.error(
      "[GET_CUSTOMER_ORDERS] Error fetching orders for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_CUSTOMER_ORDERS] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error(
          "[GET_CUSTOMER_ORDERS] Error closing connection:",
          err.message,
        ),
      );
  }
}

async function getOrder(customerId, orderId) {
  console.log(
    "[GET_ORDER] Fetching order",
    orderId,
    "for customer:",
    customerId,
  );
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[GET_ORDER] DB connection established");
    const [orders] = await connection.execute(
      "SELECT * FROM oc_order WHERE order_id = ? AND customer_id = ?",
      [orderId, customerId],
    );

    console.log("[GET_ORDER] Found", orders.length, "order(s) matching query");
    if (orders.length === 0) {
      console.warn(
        "[GET_ORDER] Order not found:",
        orderId,
        "for customer:",
        customerId,
      );
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Order not found" }),
      };
    }

    console.log("[GET_ORDER] Fetching products for order:", orderId);
    const [products] = await connection.execute(
      "SELECT * FROM oc_order_product WHERE order_id = ?",
      [orderId],
    );

    console.log(
      "[GET_ORDER] Retrieved",
      products.length,
      "product(s) for order:",
      orderId,
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        order: orders[0],
        products,
      }),
    };
  } catch (error) {
    console.error(
      "[GET_ORDER] Error fetching order",
      orderId,
      "for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[GET_ORDER] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[GET_ORDER] Error closing connection:", err.message),
      );
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

async function logout(customerId) {
  console.log("[LOGOUT] Logging out customer:", customerId);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[LOGOUT] DB connection established");
    // Delete customer's sessions
    console.log("[LOGOUT] Deleting sessions for customer:", customerId);
    const result = await connection.execute(
      "DELETE FROM opencart_sessions WHERE customer_id = ?",
      [customerId],
    );
    console.log(
      "[LOGOUT] Deleted",
      result[0].affectedRows,
      "session(s) for customer:",
      customerId,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Logged out successfully",
      }),
    };
  } catch (error) {
    console.error(
      "[LOGOUT] Error logging out customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[LOGOUT] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[LOGOUT] Error closing connection:", err.message),
      );
  }
}

async function checkSession(customerId) {
  console.log("[CHECK_SESSION] Checking session for customer:", customerId);
  let connection;
  try {
    connection = await getDBConnection();
    console.log("[CHECK_SESSION] DB connection established");
    const [sessions] = await connection.execute(
      `SELECT last_activity FROM opencart_sessions 
       WHERE customer_id = ? 
       AND last_activity > DATE_SUB(NOW(), INTERVAL 20 MINUTE)
       LIMIT 1`,
      [customerId],
    );

    console.log(
      "[CHECK_SESSION] Found",
      sessions.length,
      "active session(s) for customer:",
      customerId,
    );
    if (sessions.length === 0) {
      console.log(
        "[CHECK_SESSION] No active session for customer:",
        customerId,
      );
      return {
        statusCode: 200,
        body: JSON.stringify({
          active: false,
          message: "No active session",
        }),
      };
    }

    console.log(
      "[CHECK_SESSION] Active session found for customer:",
      customerId,
      "last_activity:",
      sessions[0].last_activity,
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        active: true,
        last_activity: sessions[0].last_activity,
      }),
    };
  } catch (error) {
    console.error(
      "[CHECK_SESSION] Error checking session for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    console.log("[CHECK_SESSION] Closing DB connection");
    await connection
      ?.end()
      .catch((err) =>
        console.error("[CHECK_SESSION] Error closing connection:", err.message),
      );
  }
}

// ============================================
// JWT VERIFICATION MIDDLEWARE
// ============================================

function verifyJWT(token) {
  console.log("[VERIFY_JWT] Verifying JWT token");
  try {
    const decoded = jwt.verify(token, CONFIG.jwt.secret);
    console.log(
      "[VERIFY_JWT] JWT token verified successfully, customer_id:",
      decoded.customer_id,
    );
    return { valid: true, customer_id: decoded.customer_id };
  } catch (error) {
    console.error(
      "[VERIFY_JWT] JWT verification failed:",
      error.name,
      "-",
      error.message,
    );
    if (error.name === "TokenExpiredError") {
      console.warn("[VERIFY_JWT] Token has expired");
      return { valid: false, error: "Token expired", expired: true };
    }
    console.warn("[VERIFY_JWT] Invalid token");
    return { valid: false, error: "Invalid token" };
  }
}

// ============================================
// LAMBDA HANDLER
// ============================================

exports.handler = async (event) => {
  console.log("\n========== [HANDLER] New Lambda Request ==========");
  console.log("[HANDLER] Received event:", JSON.stringify(event, null, 2));

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  };

  try {
    const pathWithBase =
      event.path || event.rawPath || event.requestContext?.http?.path;
    const path = pathWithBase.replace(/^\/?api\/?opencart\/?/, "/") || "/";
    const method = event.httpMethod || event.requestContext?.http?.method;
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};
    const headers = event.headers || {};

    console.log("[HANDLER] Parsed request details:", {
      path,
      method,
      queryParams,
      bodyKeys: Object.keys(body),
    });

    if (method === "OPTIONS") {
      console.log("[HANDLER] Handling CORS preflight OPTIONS request");
      return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    // ============================================
    // PUBLIC ROUTES (No Auth Required)
    // ============================================

    let response;

    // Products - Public
    if (path === "/products" && method === "GET") {
      console.log("[HANDLER] Route matched: GET /products");
      response = await getProducts(queryParams);
    } else if (path.match(/^\/products\/\d+$/) && method === "GET") {
      const productId = path.split("/")[2];
      console.log("[HANDLER] Route matched: GET /products/:id", productId);
      response = await getProduct(productId);
    } else if (path === "/products/search" && method === "GET") {
      console.log("[HANDLER] Route matched: GET /products/search");
      response = await searchProducts(queryParams);
    }

    // Categories - Public
    else if (path === "/categories" && method === "GET") {
      console.log("[HANDLER] Route matched: GET /categories");
      response = await getCategories(queryParams);
    } else if (path.match(/^\/categories\/\d+$/) && method === "GET") {
      const categoryId = path.split("/")[2];
      console.log("[HANDLER] Route matched: GET /categories/:id", categoryId);
      response = await getCategory(categoryId);
    } else if (
      path.match(/^\/categories\/\d+\/products$/) &&
      method === "GET"
    ) {
      const categoryId = path.split("/")[2];
      console.log(
        "[HANDLER] Route matched: GET /categories/:id/products",
        categoryId,
      );
      response = await getCategoryProducts(categoryId, queryParams);
    }

    // ============================================
    // AUTHENTICATED ROUTES (Require JWT)
    // ============================================
    else {
      console.log("[HANDLER] Processing authenticated route:", path);
      // Extract and verify JWT
      const token =
        headers.authorization?.replace("Bearer ", "") ||
        headers.Authorization?.replace("Bearer ", "");

      console.log(
        "[HANDLER] Authorization header",
        token ? "present" : "missing",
      );
      if (!token) {
        console.warn("[HANDLER] No authorization token provided");
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Authorization token required" }),
        };
      }

      const jwtCheck = verifyJWT(token);

      if (!jwtCheck.valid) {
        console.warn("[HANDLER] JWT verification failed:", jwtCheck.error);
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({
            error: jwtCheck.error,
            expired: jwtCheck.expired || false,
          }),
        };
      }

      const customerId = jwtCheck.customer_id;
      console.log("[HANDLER] JWT verified. Customer ID:", customerId);

      // Cart
      if (path === "/cart/add" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /cart/add");
        response = await addToCart(customerId, body);
      } else if (path === "/cart" && method === "GET") {
        console.log("[HANDLER] Route matched: GET /cart");
        response = await getCart(customerId);
      } else if (path === "/cart/remove" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /cart/remove");
        response = await removeFromCart(customerId, body.key);
      }

      // Checkout
      else if (path === "/checkout/shipping-address" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /checkout/shipping-address");
        response = await setShippingAddress(customerId, body);
      } else if (path === "/checkout/payment-address" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /checkout/payment-address");
        response = await setPaymentAddress(customerId, body);
      } else if (path === "/checkout/shipping-methods" && method === "GET") {
        console.log("[HANDLER] Route matched: GET /checkout/shipping-methods");
        response = await getShippingMethods(customerId);
      } else if (path === "/checkout/shipping-method" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /checkout/shipping-method");
        response = await setShippingMethod(customerId, body.method);
      } else if (path === "/checkout/payment-methods" && method === "GET") {
        console.log("[HANDLER] Route matched: GET /checkout/payment-methods");
        response = await getPaymentMethods(customerId);
      } else if (path === "/checkout/payment-method" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /checkout/payment-method");
        response = await setPaymentMethod(customerId, body.method);
      }

      // Orders
      else if (path === "/order/create" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /order/create");
        response = await createOrder(customerId);
      } else if (path === "/orders" && method === "GET") {
        console.log("[HANDLER] Route matched: GET /orders");
        response = await getCustomerOrders(customerId);
      } else if (path.match(/^\/orders\/\d+$/) && method === "GET") {
        const orderId = path.split("/")[2];
        console.log("[HANDLER] Route matched: GET /orders/:id", orderId);
        response = await getOrder(customerId, orderId);
      }

      // Session Management
      else if (path === "/session/status" && method === "GET") {
        console.log("[HANDLER] Route matched: GET /session/status");
        response = await checkSession(customerId);
      } else if (path === "/logout" && method === "POST") {
        console.log("[HANDLER] Route matched: POST /logout");
        response = await logout(customerId);
      } else {
        console.warn("[HANDLER] No matching route found:", method, path);
        response = {
          statusCode: 404,
          body: JSON.stringify({ error: "Not found" }),
        };
      }
    }

    console.log("[HANDLER] Response status:", response.statusCode);
    console.log("========== [HANDLER] Request Complete ==========\n");
    return {
      ...response,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("\n========== [HANDLER] FATAL ERROR ==========");
    console.error("[HANDLER] Error type:", error.name);
    console.error("[HANDLER] Error message:", error.message);
    console.error("[HANDLER] Error stack:", error.stack);
    console.error("========== [HANDLER] Request Failed ==========\n");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
    };
  }
};
