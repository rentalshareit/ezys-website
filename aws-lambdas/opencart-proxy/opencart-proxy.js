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
  try {
    const connection = await mysql.createConnection(CONFIG.db);
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
  try {
    // Check for recent session (< 15 minutes old from creation)
    const [sessions] = await connection.execute(
      `SELECT * FROM opencart_sessions 
       WHERE customer_id = ? 
       AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
       ORDER BY created_at DESC 
       LIMIT 1`,
      [customerId],
    );

    if (sessions.length > 0) {
      return {
        api_token: sessions[0].opencart_api_token,
        session_id: sessions[0].opencart_session_id,
      };
    }

    // Create new authenticated session
    const session = await createAuthenticatedSession(customerId);

    await connection.execute(
      `INSERT INTO opencart_sessions 
       (customer_id, opencart_api_token, opencart_session_id, created_at, last_activity) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      [customerId, session.api_token, session.session_id],
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
    // Step 1: Login to OpenCart API
    const loginResponse = await axios.post(
      `${CONFIG.opencart.url}/index.php?route=api/account/login`,
      new URLSearchParams({
        username: CONFIG.opencart.apiUsername,
        key: CONFIG.opencart.apiKey,
      }),
    );

    const apiToken = loginResponse.data.api_token;
    const sessionCookie = loginResponse.headers["set-cookie"]?.[0];
    const sessionId = sessionCookie?.match(/OCSESSID=([^;]+)/)?.[1];

    // Step 2: Set customer in session
    const setCustomerResponse = await axios.post(
      `${CONFIG.opencart.url}/index.php?route=api/sale/customer&api_token=${apiToken}`,
      new URLSearchParams({ customer_id: customerId.toString() }),
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
  try {
    // Check for recent public session (< 15 minutes old from creation)
    const [sessions] = await connection.execute(
      `SELECT * FROM opencart_public_sessions 
       WHERE created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
       ORDER BY created_at DESC 
       LIMIT 1`,
    );

    if (sessions.length > 0) {
      return {
        api_token: sessions[0].opencart_api_token,
        session_id: sessions[0].opencart_session_id,
        id: sessions[0].id,
      };
    }

    // Create new public session
    const session = await createPublicSession();

    await connection.execute(
      `INSERT INTO opencart_public_sessions 
       (opencart_api_token, opencart_session_id, created_at, last_activity) 
       VALUES (?, ?, NOW(), NOW())`,
      [session.api_token, session.session_id],
    );

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
  try {
    const loginResponse = await axios.post(
      `${CONFIG.opencart.url}/index.php?route=api/account/login`,
      new URLSearchParams({
        username: CONFIG.opencart.apiUsername,
        key: CONFIG.opencart.apiKey,
      }),
    );

    const apiToken = loginResponse.data.api_token;
    const sessionCookie = loginResponse.headers["set-cookie"]?.[0];
    const sessionId = sessionCookie?.match(/OCSESSID=([^;]+)/)?.[1];

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

  // Get appropriate session
  let session;

  try {
    if (requiresAuth && customerId) {
      session = await getAuthenticatedSession(connection, customerId);
    } else {
      session = await getPublicSession(connection);
    }

    // Build URL with query parameters - INCLUDE API TOKEN
    const params = new URLSearchParams({
      api_token: session.api_token,
      ...queryParams,
    });
    const url = `${CONFIG.opencart.url}/index.php?route=${route}&${params.toString()}`;

    try {
      const response = await axios({
        method,
        url,
        data: method !== "GET" ? new URLSearchParams(data) : undefined,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

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
        // Delete expired session
        if (requiresAuth && customerId) {
          await connection.execute(
            "DELETE FROM opencart_sessions WHERE customer_id = ?",
            [customerId],
          );
          session = await createAuthenticatedSession(customerId);
          await connection.execute(
            `INSERT INTO opencart_sessions 
             (customer_id, opencart_api_token, opencart_session_id, created_at, last_activity) 
             VALUES (?, ?, ?, NOW(), NOW())`,
            [customerId, session.api_token, session.session_id],
          );
        } else {
          await connection.execute(
            "DELETE FROM opencart_public_sessions WHERE id = ?",
            [session.id],
          );
          session = await createPublicSession();
          await connection.execute(
            `INSERT INTO opencart_public_sessions 
             (opencart_api_token, opencart_session_id, created_at, last_activity) 
             VALUES (?, ?, NOW(), NOW())`,
            [session.api_token, session.session_id],
          );
        }

        // Retry with new session - INCLUDE API TOKEN IN RETRY URL
        const retryParams = new URLSearchParams({
          api_token: session.api_token,
          ...queryParams,
        });
        const retryUrl = `${CONFIG.opencart.url}/index.php?route=${route}&${retryParams.toString()}`;

        const retryResponse = await axios({
          method,
          url: retryUrl,
          data: method !== "GET" ? new URLSearchParams(data) : undefined,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

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
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/catalog/product", {
      method: "GET",
      queryParams,
      requiresAuth: false,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error("[GET_PRODUCTS] Error fetching products:", error.message);
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getProduct(productId) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/catalog/product", {
      method: "GET",
      queryParams: { product_id: productId },
      requiresAuth: false,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[GET_PRODUCT] Error fetching product",
      productId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function searchProducts(queryParams) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(
      connection,
      "api/catalog/product|search",
      {
        method: "GET",
        queryParams,
        requiresAuth: false,
      },
    );
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error("[SEARCH_PRODUCTS] Error searching products:", error.message);
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getCategories(queryParams) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/catalog/category", {
      method: "GET",
      queryParams,
      requiresAuth: false,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error("[GET_CATEGORIES] Error fetching categories:", error.message);
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getCategory(categoryId) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/catalog/category", {
      method: "GET",
      queryParams: { category_id: categoryId },
      requiresAuth: false,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[GET_CATEGORY] Error fetching category",
      categoryId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getCategoryProducts(categoryId, queryParams) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(
      connection,
      "api/catalog/category|products",
      {
        method: "GET",
        queryParams: { category_id: categoryId, ...queryParams },
        requiresAuth: false,
      },
    );
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[GET_CATEGORY_PRODUCTS] Error fetching category products",
      categoryId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

// ============================================
// AUTHENTICATED API ENDPOINTS (Require Auth)
// ============================================

async function addToCart(customerId, data) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/sale/cart", {
      method: "POST",
      data,
      customerId,
      requiresAuth: true,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[ADD_TO_CART] Error adding to cart for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getCart(customerId) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/sale/cart", {
      method: "GET",
      customerId,
      requiresAuth: true,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[GET_CART] Error fetching cart for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function removeFromCart(customerId, key) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/sale/cart", {
      method: "POST",
      data: { key, quantity: 0 },
      customerId,
      requiresAuth: true,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[REMOVE_FROM_CART] Error removing from cart for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function setShippingAddress(customerId, address) {
  let connection;
  try {
    connection = await getDBConnection();
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
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[SET_SHIPPING_ADDRESS] Error setting shipping address for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function setPaymentAddress(customerId, address) {
  let connection;
  try {
    connection = await getDBConnection();
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
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[SET_PAYMENT_ADDRESS] Error setting payment address for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getShippingMethods(customerId) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(
      connection,
      "api/sale/shipping_method",
      {
        method: "GET",
        customerId,
        requiresAuth: true,
      },
    );
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[GET_SHIPPING_METHODS] Error fetching shipping methods for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function setShippingMethod(customerId, method) {
  let connection;
  try {
    connection = await getDBConnection();
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
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[SET_SHIPPING_METHOD] Error setting shipping method for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getPaymentMethods(customerId) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(
      connection,
      "api/sale/payment_method",
      {
        method: "GET",
        customerId,
        requiresAuth: true,
      },
    );
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[GET_PAYMENT_METHODS] Error fetching payment methods for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function setPaymentMethod(customerId, method) {
  let connection;
  try {
    connection = await getDBConnection();
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
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[SET_PAYMENT_METHOD] Error setting payment method for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function createOrder(customerId) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await callOpenCartAPI(connection, "api/sale/order", {
      method: "POST",
      customerId,
      requiresAuth: true,
    });
    return { statusCode: 200, body: formatResponseBody(result) };
  } catch (error) {
    console.error(
      "[CREATE_ORDER] Error creating order for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getCustomerOrders(customerId) {
  let connection;
  try {
    connection = await getDBConnection();
    const [orders] = await connection.execute(
      "SELECT * FROM oc_order WHERE customer_id = ? ORDER BY date_added DESC",
      [customerId],
    );
    return { statusCode: 200, body: formatResponseBody({ orders }) };
  } catch (error) {
    console.error(
      "[GET_CUSTOMER_ORDERS] Error fetching orders for customer",
      customerId,
      ":",
      error.message,
    );
    throw error;
  } finally {
    await connection?.end().catch((err) => {});
  }
}

async function getOrder(customerId, orderId) {
  let connection;
  try {
    connection = await getDBConnection();
    const [orders] = await connection.execute(
      "SELECT * FROM oc_order WHERE order_id = ? AND customer_id = ?",
      [orderId, customerId],
    );

    if (orders.length === 0) {
      return {
        statusCode: 404,
        body: formatResponseBody({ error: "Order not found" }),
      };
    }

    const [products] = await connection.execute(
      "SELECT * FROM oc_order_product WHERE order_id = ?",
      [orderId],
    );

    return {
      statusCode: 200,
      body: formatResponseBody({
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
    await connection?.end().catch((err) => {});
  }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

async function logout(customerId) {
  let connection;
  try {
    connection = await getDBConnection();
    const result = await connection.execute(
      "DELETE FROM opencart_sessions WHERE customer_id = ?",
      [customerId],
    );

    return {
      statusCode: 200,
      body: formatResponseBody({
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
    await connection?.end().catch((err) => {});
  }
}

async function checkSession(customerId) {
  let connection;
  try {
    connection = await getDBConnection();
    const [sessions] = await connection.execute(
      `SELECT created_at FROM opencart_sessions 
       WHERE customer_id = ? 
       AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
       LIMIT 1`,
      [customerId],
    );

    if (sessions.length === 0) {
      return {
        statusCode: 200,
        body: formatResponseBody({
          active: false,
          message: "No active session",
        }),
      };
    }

    return {
      statusCode: 200,
      body: formatResponseBody({
        active: true,
        created_at: sessions[0].created_at,
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
    await connection?.end().catch((err) => {});
  }
}

// ============================================
// JWT VERIFICATION MIDDLEWARE
// ============================================

function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, CONFIG.jwt.secret);
    return { valid: true, customer_id: decoded.customer_id };
  } catch (error) {
    console.error(
      "[VERIFY_JWT] JWT verification failed:",
      error.name,
      "-",
      error.message,
    );
    if (error.name === "TokenExpiredError") {
      return { valid: false, error: "Token expired", expired: true };
    }
    return { valid: false, error: "Invalid token" };
  }
}

// Add this near the top with other utility functions
function formatResponseBody(data) {
  return typeof data === "string" ? data : JSON.stringify(data);
}

// ============================================
// LAMBDA HANDLER
// ============================================

exports.handler = async (event) => {
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

    if (method === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    // ============================================
    // PUBLIC ROUTES (No Auth Required)
    // ============================================

    let response;

    // Products - Public
    if (path === "/products" && method === "GET") {
      response = await getProducts(queryParams);
    } else if (path.match(/^\/products\/\d+$/) && method === "GET") {
      const productId = path.split("/")[2];
      response = await getProduct(productId);
    } else if (path === "/products/search" && method === "GET") {
      response = await searchProducts(queryParams);
    }

    // Categories - Public
    else if (path === "/categories" && method === "GET") {
      response = await getCategories(queryParams);
    } else if (path.match(/^\/categories\/\d+$/) && method === "GET") {
      const categoryId = path.split("/")[2];
      response = await getCategory(categoryId);
    } else if (
      path.match(/^\/categories\/\d+\/products$/) &&
      method === "GET"
    ) {
      const categoryId = path.split("/")[2];
      response = await getCategoryProducts(categoryId, queryParams);
    }

    // ============================================
    // AUTHENTICATED ROUTES (Require JWT)
    // ============================================
    else {
      // Extract and verify JWT
      const token =
        headers.authorization?.replace("Bearer ", "") ||
        headers.Authorization?.replace("Bearer ", "");

      if (!token) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Authorization token required" }),
        };
      }

      const jwtCheck = verifyJWT(token);

      if (!jwtCheck.valid) {
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

      // Cart
      if (path === "/cart/add" && method === "POST") {
        response = await addToCart(customerId, body);
      } else if (path === "/cart" && method === "GET") {
        response = await getCart(customerId);
      } else if (path === "/cart/remove" && method === "POST") {
        response = await removeFromCart(customerId, body.key);
      }

      // Checkout
      else if (path === "/checkout/shipping-address" && method === "POST") {
        response = await setShippingAddress(customerId, body);
      } else if (path === "/checkout/payment-address" && method === "POST") {
        response = await setPaymentAddress(customerId, body);
      } else if (path === "/checkout/shipping-methods" && method === "GET") {
        response = await getShippingMethods(customerId);
      } else if (path === "/checkout/shipping-method" && method === "POST") {
        response = await setShippingMethod(customerId, body.method);
      } else if (path === "/checkout/payment-methods" && method === "GET") {
        response = await getPaymentMethods(customerId);
      } else if (path === "/checkout/payment-method" && method === "POST") {
        response = await setPaymentMethod(customerId, body.method);
      }

      // Orders
      else if (path === "/order/create" && method === "POST") {
        response = await createOrder(customerId);
      } else if (path === "/orders" && method === "GET") {
        response = await getCustomerOrders(customerId);
      } else if (path.match(/^\/orders\/\d+$/) && method === "GET") {
        const orderId = path.split("/")[2];
        response = await getOrder(customerId, orderId);
      }

      // Session Management
      else if (path === "/session/status" && method === "GET") {
        response = await checkSession(customerId);
      } else if (path === "/logout" && method === "POST") {
        response = await logout(customerId);
      } else {
        response = {
          statusCode: 404,
          body: JSON.stringify({ error: "Not found" }),
        };
      }
    }

    return {
      ...response,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("[HANDLER] FATAL ERROR:", {
      errorType: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
    });
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
