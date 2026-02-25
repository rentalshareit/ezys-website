/**
 * AWS Lambda Handler - Rental System API
 * Complete implementation of all 14 rental endpoints
 * Node.js 18.x runtime
 */

const mysql = require("mysql2/promise");

// Database configuration (set via Lambda environment variables)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
};

// Response helper
const response = (statusCode, body) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify(body),
});

// Main Lambda handler
exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  // Handle OPTIONS for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return response(200, { message: "OK" });
  }

  const path = event.path;
  const method = event.httpMethod;
  const pathParams = event.pathParameters || {};
  const queryParams = event.queryStringParameters || {};

  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch (e) {
    return response(400, { error: "Invalid JSON body" });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Route handling
    if (method === "GET" && path.match(/^\/products\/\d+\/rental-info$/)) {
      return await getRentalInfo(
        connection,
        pathParams.product_id || path.split("/")[2],
      );
    }

    if (method === "POST" && path === "/availability/check") {
      return await checkAvailability(connection, body);
    }

    if (method === "GET" && path.match(/^\/availability\/calendar\/\d+$/)) {
      return await getAvailabilityCalendar(
        connection,
        pathParams.product_id || path.split("/")[3],
        queryParams,
      );
    }

    if (method === "POST" && path === "/pricing/calculate") {
      return await calculatePricing(connection, body);
    }

    if (method === "POST" && path === "/bookings") {
      return await createBooking(connection, body);
    }

    if (method === "POST" && path.match(/^\/bookings\/\d+\/confirm$/)) {
      return await confirmBooking(
        connection,
        pathParams.booking_id || path.split("/")[2],
        body,
      );
    }

    if (method === "GET" && path.match(/^\/bookings\/\d+$/)) {
      return await getBooking(
        connection,
        pathParams.booking_id || path.split("/")[2],
      );
    }

    if (method === "GET" && path.match(/^\/bookings\/reference\/.+$/)) {
      return await getBookingByReference(
        connection,
        pathParams.reference || path.split("/")[3],
      );
    }

    if (method === "GET" && path.match(/^\/customers\/\d+\/bookings$/)) {
      return await getCustomerBookings(
        connection,
        pathParams.customer_id || path.split("/")[2],
      );
    }

    if (method === "POST" && path.match(/^\/bookings\/\d+\/cancel$/)) {
      return await cancelBooking(
        connection,
        pathParams.booking_id || path.split("/")[2],
        body,
      );
    }

    if (method === "POST" && path.match(/^\/bookings\/\d+\/pickup$/)) {
      return await processPickup(
        connection,
        pathParams.booking_id || path.split("/")[2],
        body,
      );
    }

    if (method === "POST" && path.match(/^\/bookings\/\d+\/return$/)) {
      return await processReturn(
        connection,
        pathParams.booking_id || path.split("/")[2],
        body,
      );
    }

    if (method === "GET" && path === "/admin/overdue") {
      return await getOverdueRentals(connection);
    }

    if (method === "PUT" && path.match(/^\/admin\/products\/\d+\/inventory$/)) {
      return await updateInventory(
        connection,
        pathParams.product_id || path.split("/")[3],
        body,
      );
    }

    return response(404, { error: "Endpoint not found" });
  } catch (error) {
    console.error("Error:", error);
    return response(500, {
      error: "Internal server error",
      message: error.message,
    });
  } finally {
    if (connection) await connection.end();
  }
};

// ============================================
// ENDPOINT IMPLEMENTATIONS
// ============================================

// 1. Get Rental Info
async function getRentalInfo(connection, productId) {
  const [products] = await connection.execute(
    `SELECT rp.*, 
            (SELECT COUNT(*) FROM rental_availability ra 
             WHERE ra.rental_product_id = rp.rental_product_id 
             AND ra.availability_date = CURDATE()
             AND (ra.total_quantity - ra.booked_quantity - ra.blocked_quantity) > 0) as available_inventory
         FROM rental_products rp 
         WHERE rp.product_id = ?`,
    [productId],
  );

  if (products.length === 0) {
    return response(404, { error: "Product not configured for rental" });
  }

  const product = products[0];

  const [pricingTiers] = await connection.execute(
    `SELECT * FROM rental_pricing 
         WHERE rental_product_id = ? 
         ORDER BY min_days`,
    [product.rental_product_id],
  );

  return response(200, {
    rental_product_id: product.rental_product_id,
    product_id: product.product_id,
    is_rentable: product.is_rentable === 1,
    total_inventory: product.total_inventory,
    available_inventory: product.available_inventory || product.total_inventory,
    deposit_amount: parseFloat(product.deposit_amount),
    base_daily_rate: parseFloat(product.base_daily_rate),
    late_fee_per_day: parseFloat(product.late_fee_per_day),
    min_rental_days: product.min_rental_days,
    max_rental_days: product.max_rental_days,
    pricing_tiers: pricingTiers.map((tier) => ({
      min_days: tier.min_days,
      max_days: tier.max_days,
      daily_rate: parseFloat(tier.daily_rate),
      discount_percent: parseFloat(tier.discount_percent),
    })),
  });
}

// 2. Check Availability
async function checkAvailability(connection, body) {
  const { product_id, start_date, end_date, quantity = 1 } = body;

  if (!product_id || !start_date || !end_date) {
    return response(400, {
      error: "Missing required fields: product_id, start_date, end_date",
    });
  }

  // Get rental product
  const [products] = await connection.execute(
    "SELECT * FROM rental_products WHERE product_id = ?",
    [product_id],
  );

  if (products.length === 0) {
    return response(404, { error: "Product not found" });
  }

  const rentalProduct = products[0];

  // Calculate rental days
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  if (rentalDays < 1) {
    return response(400, { error: "End date must be after start date" });
  }

  // Check availability for each date
  const [availability] = await connection.execute(
    `SELECT MIN(total_quantity - booked_quantity - blocked_quantity) as min_available
         FROM rental_availability
         WHERE rental_product_id = ?
         AND availability_date >= ?
         AND availability_date < ?`,
    [rentalProduct.rental_product_id, start_date, end_date],
  );

  const availableQuantity =
    availability[0]?.min_available ?? rentalProduct.total_inventory;
  const isAvailable = availableQuantity >= quantity;

  return response(200, {
    available: isAvailable,
    product_id: parseInt(product_id),
    start_date,
    end_date,
    rental_days: rentalDays,
    available_quantity: availableQuantity,
    requested_quantity: quantity,
  });
}

// 3. Get Availability Calendar
async function getAvailabilityCalendar(connection, productId, queryParams) {
  const { start_date, end_date } = queryParams;

  if (!start_date || !end_date) {
    return response(400, {
      error: "Missing required parameters: start_date, end_date",
    });
  }

  const [products] = await connection.execute(
    "SELECT * FROM rental_products WHERE product_id = ?",
    [productId],
  );

  if (products.length === 0) {
    return response(404, { error: "Product not found" });
  }

  const rentalProduct = products[0];

  const [availability] = await connection.execute(
    `SELECT 
            availability_date as date,
            total_quantity,
            booked_quantity,
            blocked_quantity,
            (total_quantity - booked_quantity - blocked_quantity) as available_quantity
         FROM rental_availability
         WHERE rental_product_id = ?
         AND availability_date BETWEEN ? AND ?
         ORDER BY availability_date`,
    [rentalProduct.rental_product_id, start_date, end_date],
  );

  return response(200, {
    product_id: parseInt(productId),
    availability: availability.map((day) => ({
      date: day.date,
      total_quantity: day.total_quantity,
      available_quantity: day.available_quantity,
      booked_quantity: day.booked_quantity,
      blocked_quantity: day.blocked_quantity,
    })),
  });
}

// 4. Calculate Pricing
async function calculatePricing(connection, body) {
  const { product_id, start_date, end_date } = body;

  if (!product_id || !start_date || !end_date) {
    return response(400, { error: "Missing required fields" });
  }

  const [products] = await connection.execute(
    "SELECT * FROM rental_products WHERE product_id = ?",
    [product_id],
  );

  if (products.length === 0) {
    return response(404, { error: "Product not found" });
  }

  const product = products[0];

  // Calculate rental days
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Get pricing tiers
  const [tiers] = await connection.execute(
    `SELECT * FROM rental_pricing 
         WHERE rental_product_id = ? 
         AND min_days <= ?
         AND (max_days >= ? OR max_days IS NULL)
         ORDER BY min_days DESC
         LIMIT 1`,
    [product.rental_product_id, rentalDays, rentalDays],
  );

  let dailyRate = parseFloat(product.base_daily_rate);
  let discountPercent = 0;
  let pricingTier = null;

  if (tiers.length > 0) {
    dailyRate = parseFloat(tiers[0].daily_rate);
    discountPercent = parseFloat(tiers[0].discount_percent);
    pricingTier = {
      min_days: tiers[0].min_days,
      max_days: tiers[0].max_days,
      daily_rate: dailyRate,
      discount_percent: discountPercent,
    };
  }

  const rentalSubtotal = dailyRate * rentalDays;
  const depositAmount = parseFloat(product.deposit_amount);
  const totalAmount = rentalSubtotal + depositAmount;

  return response(200, {
    product_id: parseInt(product_id),
    start_date,
    end_date,
    rental_days: rentalDays,
    daily_rate: dailyRate,
    discount_percent: discountPercent,
    rental_subtotal: rentalSubtotal,
    deposit_amount: depositAmount,
    total_amount: totalAmount,
    pricing_tier: pricingTier,
  });
}

// 5. Create Booking
async function createBooking(connection, body) {
  const {
    product_id,
    customer_id,
    customer_firstname,
    customer_lastname,
    customer_email,
    customer_telephone,
    start_date,
    end_date,
    notes,
  } = body;

  if (
    !product_id ||
    !customer_firstname ||
    !customer_lastname ||
    !customer_email ||
    !start_date ||
    !end_date
  ) {
    return response(400, { error: "Missing required fields" });
  }

  // Get rental product
  const [products] = await connection.execute(
    "SELECT * FROM rental_products WHERE product_id = ?",
    [product_id],
  );

  if (products.length === 0) {
    return response(404, { error: "Product not found" });
  }

  const product = products[0];

  // Calculate pricing
  const pricingResult = await calculatePricing(connection, {
    product_id,
    start_date,
    end_date,
  });
  const pricing = JSON.parse(pricingResult.body);

  // Generate booking reference
  const bookingReference =
    "RNT-" +
    Math.random().toString(36).substring(2, 5).toUpperCase() +
    "-" +
    Date.now().toString().substring(8);

  // Set expiration (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Insert booking
  const [result] = await connection.execute(
    `INSERT INTO rental_bookings (
            booking_reference, product_id, customer_id, customer_firstname, customer_lastname,
            customer_email, customer_telephone, rental_product_id, rental_start_date, rental_end_date,
            rental_days, daily_rate, rental_subtotal, deposit_amount, total_amount,
            payment_status, status, customer_notes, date_added, date_modified, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
    [
      bookingReference,
      product_id,
      customer_id || null,
      customer_firstname,
      customer_lastname,
      customer_email,
      customer_telephone || "",
      product.rental_product_id,
      start_date,
      end_date,
      pricing.rental_days,
      pricing.daily_rate,
      pricing.rental_subtotal,
      pricing.deposit_amount,
      pricing.total_amount,
      "unpaid",
      "pending",
      notes || "",
      expiresAt,
    ],
  );

  return response(201, {
    success: true,
    booking_id: result.insertId,
    booking_reference: bookingReference,
    status: "pending",
    expires_at: expiresAt.toISOString(),
    rental_days: pricing.rental_days,
    daily_rate: pricing.daily_rate,
    rental_subtotal: pricing.rental_subtotal,
    deposit_amount: pricing.deposit_amount,
    total_amount: pricing.total_amount,
  });
}

// 6. Confirm Booking
async function confirmBooking(connection, bookingId, body) {
  const { opencart_order_id, payment_method, transaction_id } = body;

  // Get booking
  const [bookings] = await connection.execute(
    "SELECT * FROM rental_bookings WHERE rental_booking_id = ?",
    [bookingId],
  );

  if (bookings.length === 0) {
    return response(404, { error: "Booking not found" });
  }

  const booking = bookings[0];

  if (booking.status !== "pending") {
    return response(400, { error: "Booking is not in pending status" });
  }

  await connection.beginTransaction();

  try {
    // Update booking status
    await connection.execute(
      `UPDATE rental_bookings 
             SET status = 'confirmed', 
                 order_id = ?,
                 payment_status = 'fully_paid',
                 amount_paid = total_amount,
                 date_modified = NOW()
             WHERE rental_booking_id = ?`,
      [opencart_order_id || null, bookingId],
    );

    // Block dates in availability calendar
    await blockBookingDates(connection, booking);

    await connection.commit();

    return response(200, {
      success: true,
      booking_id: parseInt(bookingId),
      booking_reference: booking.booking_reference,
      status: "confirmed",
      message: "Booking confirmed. Dates blocked in calendar.",
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

// Helper: Block booking dates
async function blockBookingDates(connection, booking) {
  const startDate = new Date(booking.rental_start_date);
  const endDate = new Date(booking.rental_end_date);

  let currentDate = new Date(startDate);

  while (currentDate < endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];

    // Insert or update availability
    await connection.execute(
      `INSERT INTO rental_availability 
             (rental_product_id, availability_date, total_quantity, booked_quantity, blocked_quantity, date_modified)
             SELECT ?, ?, total_inventory, 1, 0, NOW()
             FROM rental_products WHERE rental_product_id = ?
             ON DUPLICATE KEY UPDATE 
             booked_quantity = booked_quantity + 1,
             date_modified = NOW()`,
      [booking.rental_product_id, dateStr, booking.rental_product_id],
    );

    // Insert booking date link
    await connection.execute(
      `INSERT INTO rental_booking_dates 
             (rental_booking_id, rental_product_id, booking_date)
             VALUES (?, ?, ?)`,
      [booking.rental_booking_id, booking.rental_product_id, dateStr],
    );

    currentDate.setDate(currentDate.getDate() + 1);
  }
}

// 7. Get Booking
async function getBooking(connection, bookingId) {
  const [bookings] = await connection.execute(
    `SELECT rb.*, pd.name as product_name
         FROM rental_bookings rb
         LEFT JOIN oc_product_description pd ON rb.product_id = pd.product_id AND pd.language_id = 1
         WHERE rb.rental_booking_id = ?`,
    [bookingId],
  );

  if (bookings.length === 0) {
    return response(404, { error: "Booking not found" });
  }

  return response(200, formatBooking(bookings[0]));
}

// 8. Get Booking by Reference
async function getBookingByReference(connection, reference) {
  const [bookings] = await connection.execute(
    `SELECT rb.*, pd.name as product_name
         FROM rental_bookings rb
         LEFT JOIN oc_product_description pd ON rb.product_id = pd.product_id AND pd.language_id = 1
         WHERE rb.booking_reference = ?`,
    [reference],
  );

  if (bookings.length === 0) {
    return response(404, { error: "Booking not found" });
  }

  return response(200, formatBooking(bookings[0]));
}

// 9. Get Customer Bookings
async function getCustomerBookings(connection, customerId) {
  const [bookings] = await connection.execute(
    `SELECT rb.*, pd.name as product_name
         FROM rental_bookings rb
         LEFT JOIN oc_product_description pd ON rb.product_id = pd.product_id AND pd.language_id = 1
         WHERE rb.customer_id = ? OR rb.customer_email = (SELECT email FROM oc_customer WHERE customer_id = ?)
         ORDER BY rb.date_added DESC`,
    [customerId, customerId],
  );

  return response(200, {
    customer_id: parseInt(customerId),
    bookings: bookings.map(formatBooking),
  });
}

// 10. Cancel Booking
async function cancelBooking(connection, bookingId, body) {
  const { reason } = body;

  const [bookings] = await connection.execute(
    "SELECT * FROM rental_bookings WHERE rental_booking_id = ?",
    [bookingId],
  );

  if (bookings.length === 0) {
    return response(404, { error: "Booking not found" });
  }

  const booking = bookings[0];

  if (!["pending", "confirmed"].includes(booking.status)) {
    return response(400, { error: "Cannot cancel booking in current status" });
  }

  await connection.beginTransaction();

  try {
    // Update booking
    await connection.execute(
      `UPDATE rental_bookings 
             SET status = 'cancelled',
                 admin_notes = CONCAT(COALESCE(admin_notes, ''), '\n[', NOW(), '] Cancelled: ', ?),
                 date_modified = NOW()
             WHERE rental_booking_id = ?`,
      [reason || "No reason provided", bookingId],
    );

    // Release dates if confirmed
    if (booking.status === "confirmed") {
      await releaseBookingDates(connection, bookingId);
    }

    await connection.commit();

    return response(200, {
      success: true,
      booking_id: parseInt(bookingId),
      status: "cancelled",
      message: "Booking cancelled. Dates released.",
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

// Helper: Release booking dates
async function releaseBookingDates(connection, bookingId) {
  await connection.execute(
    `UPDATE rental_availability ra
         INNER JOIN rental_booking_dates rbd 
         ON ra.rental_product_id = rbd.rental_product_id 
         AND ra.availability_date = rbd.booking_date
         SET ra.booked_quantity = ra.booked_quantity - 1,
             ra.date_modified = NOW()
         WHERE rbd.rental_booking_id = ?`,
    [bookingId],
  );

  await connection.execute(
    "DELETE FROM rental_booking_dates WHERE rental_booking_id = ?",
    [bookingId],
  );
}

// 11. Process Pickup
async function processPickup(connection, bookingId, body) {
  const { notes } = body;

  await connection.execute(
    `UPDATE rental_bookings 
         SET actual_pickup_date = NOW(),
             status = 'active',
             admin_notes = CONCAT(COALESCE(admin_notes, ''), '\n[', NOW(), '] Pickup: ', ?),
             date_modified = NOW()
         WHERE rental_booking_id = ? AND status = 'confirmed'`,
    [notes || "Processed", bookingId],
  );

  return response(200, {
    success: true,
    booking_id: parseInt(bookingId),
    status: "active",
    pickup_time: new Date().toISOString(),
  });
}

// 12. Process Return
async function processReturn(connection, bookingId, body) {
  const { condition, damage_fee = 0, notes } = body;

  const [bookings] = await connection.execute(
    `SELECT rb.*, rp.late_fee_per_day
         FROM rental_bookings rb
         JOIN rental_products rp ON rb.rental_product_id = rp.rental_product_id
         WHERE rb.rental_booking_id = ?`,
    [bookingId],
  );

  if (bookings.length === 0) {
    return response(404, { error: "Booking not found" });
  }

  const booking = bookings[0];

  // Calculate late fee
  const endDate = new Date(booking.rental_end_date);
  const now = new Date();
  let lateFee = 0;
  let daysLate = 0;

  if (now > endDate) {
    daysLate = Math.ceil((now - endDate) / (1000 * 60 * 60 * 24));
    lateFee = daysLate * parseFloat(booking.late_fee_per_day);
  }

  const totalFees = lateFee + parseFloat(damage_fee);
  const depositRefund = Math.max(
    0,
    parseFloat(booking.deposit_amount) - totalFees,
  );

  await connection.beginTransaction();

  try {
    await connection.execute(
      `UPDATE rental_bookings 
             SET actual_return_date = NOW(),
                 status = 'completed',
                 late_fee = ?,
                 damage_fee = ?,
                 admin_notes = CONCAT(COALESCE(admin_notes, ''), '\n[', NOW(), '] Return - Days late: ', ?, ', Condition: ', ?, ', Notes: ', ?),
                 date_modified = NOW()
             WHERE rental_booking_id = ?`,
      [
        lateFee,
        damage_fee,
        daysLate,
        condition || "Not specified",
        notes || "None",
        bookingId,
      ],
    );

    await releaseBookingDates(connection, bookingId);

    await connection.commit();

    return response(200, {
      success: true,
      booking_id: parseInt(bookingId),
      status: "completed",
      return_time: now.toISOString(),
      late_fee: lateFee,
      damage_fee: parseFloat(damage_fee),
      total_fees: totalFees,
      deposit_refund: depositRefund,
      days_late: daysLate,
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

// 13. Get Overdue Rentals
async function getOverdueRentals(connection) {
  const [rentals] = await connection.execute(
    `SELECT 
            rb.rental_booking_id,
            rb.booking_reference,
            rb.customer_firstname,
            rb.customer_lastname,
            rb.customer_email,
            rb.customer_telephone,
            rb.rental_end_date as due_date,
            DATEDIFF(CURDATE(), rb.rental_end_date) as days_overdue,
            rp.late_fee_per_day,
            (DATEDIFF(CURDATE(), rb.rental_end_date) * rp.late_fee_per_day) as calculated_late_fee,
            rb.deposit_amount,
            pd.name as product_name
         FROM rental_bookings rb
         JOIN rental_products rp ON rb.rental_product_id = rp.rental_product_id
         LEFT JOIN oc_product_description pd ON rb.product_id = pd.product_id AND pd.language_id = 1
         WHERE rb.status = 'active'
         AND rb.rental_end_date < CURDATE()
         ORDER BY days_overdue DESC`,
  );

  return response(200, {
    overdue_rentals: rentals.map((rental) => ({
      booking_reference: rental.booking_reference,
      customer_name: `${rental.customer_firstname} ${rental.customer_lastname}`,
      customer_email: rental.customer_email,
      customer_telephone: rental.customer_telephone,
      product_name: rental.product_name,
      due_date: rental.due_date,
      days_overdue: rental.days_overdue,
      late_fee_per_day: parseFloat(rental.late_fee_per_day),
      calculated_late_fee: parseFloat(rental.calculated_late_fee),
      deposit_amount: parseFloat(rental.deposit_amount),
    })),
  });
}

// 14. Update Inventory
async function updateInventory(connection, productId, body) {
  const { total_inventory } = body;

  if (!total_inventory || total_inventory < 1) {
    return response(400, { error: "Invalid inventory value" });
  }

  const [products] = await connection.execute(
    "SELECT * FROM rental_products WHERE product_id = ?",
    [productId],
  );

  if (products.length === 0) {
    return response(404, { error: "Product not found" });
  }

  const oldInventory = products[0].total_inventory;

  await connection.execute(
    "UPDATE rental_products SET total_inventory = ?, date_modified = NOW() WHERE product_id = ?",
    [total_inventory, productId],
  );

  await connection.execute(
    "UPDATE rental_availability SET total_quantity = ?, date_modified = NOW() WHERE rental_product_id = ?",
    [total_inventory, products[0].rental_product_id],
  );

  return response(200, {
    success: true,
    product_id: parseInt(productId),
    old_inventory: oldInventory,
    new_inventory: parseInt(total_inventory),
  });
}

// Helper: Format booking response
function formatBooking(booking) {
  return {
    rental_booking_id: booking.rental_booking_id,
    booking_reference: booking.booking_reference,
    product_id: booking.product_id,
    product_name: booking.product_name,
    customer_id: booking.customer_id,
    customer_firstname: booking.customer_firstname,
    customer_lastname: booking.customer_lastname,
    customer_email: booking.customer_email,
    customer_telephone: booking.customer_telephone,
    rental_start_date: booking.rental_start_date,
    rental_end_date: booking.rental_end_date,
    rental_days: booking.rental_days,
    daily_rate: parseFloat(booking.daily_rate),
    rental_subtotal: parseFloat(booking.rental_subtotal),
    deposit_amount: parseFloat(booking.deposit_amount),
    total_amount: parseFloat(booking.total_amount),
    payment_status: booking.payment_status,
    amount_paid: parseFloat(booking.amount_paid || 0),
    status: booking.status,
    actual_pickup_date: booking.actual_pickup_date,
    actual_return_date: booking.actual_return_date,
    late_fee: parseFloat(booking.late_fee || 0),
    damage_fee: parseFloat(booking.damage_fee || 0),
    customer_notes: booking.customer_notes,
    admin_notes: booking.admin_notes,
    date_added: booking.date_added,
    date_modified: booking.date_modified,
  };
}
