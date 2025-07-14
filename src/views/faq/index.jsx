import React from "react";

const FAQ = () => {
  return (
    <main className="content">
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem", // Consistent padding for all screen sizes
          width: "100%", // Ensure the root div takes full width
        }}
      >
        {/* Header Section */}
        <header
          style={{
            width: "100%",
            backgroundColor: "#ffffff", // bg-white
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // shadow-md
            borderRadius: "0.5rem", // rounded-lg
            padding: "1.5rem", // p-6
            marginBottom: "2rem", // mb-8
            textAlign: "left", // Changed from 'center' to 'left'
          }}
        >
          <h1
            style={{
              fontSize: "2rem", // Adjusted for consistent sizing
              fontWeight: "700", // font-bold
              color: "rgb(13,148,136)", // Changed primary color
              marginBottom: "0.5rem", // mb-2
            }}
          >
            ❓ Frequently Asked Questions
          </h1>
        </header>

        {/* Main Content Area */}
        <main
          style={{
            width: "100%",

            backgroundColor: "#ffffff", // bg-white
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // shadow-lg
            borderRadius: "0.5rem", // rounded-lg
            padding: "2.5rem", // Consistent padding for all screen sizes (lg:p-10 equivalent)
            marginBottom: "2rem", // mb-8
          }}
        >
          {/* Section 1: Free Cancellations – Before Shipping */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem", // Adjusted for consistent sizing
                fontWeight: "600", // font-semibold
                color: "rgb(13,148,136)", // Changed primary color
                marginBottom: "1rem", // mb-4
                borderBottom: "1px solid #e5e7eb", // border-b
                paddingBottom: "0.5rem", // pb-2
                textAlign: "left", // Added for left alignment
              }}
            >
              1. How can I rent from Ezys?
            </h2>
            <p
              style={{
                marginBottom: "1rem", // mb-4
                lineHeight: "1.625", // leading-relaxed
              }}
            >
              Renting is easy!
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Browse our product collection</li>
              <li>Select your rental dates</li>
              <li>Add items to your cart and proceed to checkout</li>
              <li>Complete your KYC to confirm your order</li>
            </ul>
          </section>
          {/* Section 2 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              2. What is the minimum and maximum rental duration?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              You can rent any product for a minimum of 1 day and up to 30 days.
              Only one extension is allowed per rental.
            </p>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              3. How is the rental fee calculated?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Our pricing model is duration-based—the longer you rent, the lower
              the per-day price.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              4. Can I pay upon delivery?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Yes, Pay on Delivery is available. KYC must be completed before
              delivery.
            </p>
          </section>

          {/* Section 5 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              5. What are the available payment options?
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>UPI</li>
              <li>Credit/Debit Cards</li>
              <li>Net Banking</li>
              <li>Digital Wallets</li>
            </ul>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Note: We do not accept cash.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              6. Is there any security deposit?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              No. Ezys follows a zero-security deposit model.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              7. What are the shipping charges?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Shipping charges range from ₹99 to ₹299, based on your location.
            </p>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              8. When will my product be delivered?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              You can choose both the delivery date and a preferred time slot
              while placing the order. Once your KYC is verified (within 6
              hours), your order will be confirmed and scheduled accordingly.
            </p>
          </section>

          {/* Section 9 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              9. How is the return time calculated?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Rental duration is based on 24-hour cycles from delivery. For
              example, if your product is delivered at 11 AM, return pickup will
              be scheduled after 11 AM on your last rental day.
            </p>
          </section>

          {/* Section 10 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              10. What documents are required to place an order?
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>A valid government ID</li>
              <li>Proof of address (Aadhaar works for both)</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              11. Can I cancel my order?
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Free cancellation before shipping</li>
              <li>After shipping: shipping fees + 1-day rental may apply</li>
              <li>No refunds once the item is delivered</li>
            </ul>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              View full Cancellation Policy
            </p>
          </section>

          {/* Section 12 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              12. How long does it take to process refunds?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Refunds (if applicable) are processed within 5–7 working days
              after the product is returned and inspected.
            </p>
          </section>

          {/* Section 13 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              13. Can I extend my rental?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Yes, you can extend once per rental, depending on availability.
              Further use will require a new order.
            </p>
          </section>

          {/* Section 14 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              14. Will I be charged for late returns?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Yes, late return fees apply. Please contact us if you need more
              time.
            </p>
          </section>

          {/* Section 15 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              15. Can I modify my rental period after delivery?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Yes, you can change dates after delivery. Charges will be adjusted
              based on the updated rental duration.
            </p>
          </section>

          {/* Section 16 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              16. Do I need to be present at the time of delivery?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Yes, either you or a trusted representative must be available to
              receive and sign for the product.
            </p>
          </section>

          {/* Section 17 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              17. What if the product is damaged or incorrect on arrival?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Report any issue within 24 hours of delivery. We’ll inspect and
              arrange for a replacement or refund as needed.
            </p>
          </section>

          {/* Section 18 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              18. What if my order is delayed or never arrives?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Contact our support team immediately. We’ll ensure swift
              resolution.
            </p>
          </section>

          {/* Section 19 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              19. Will I be charged for damage?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Yes, if external damage or tampering is found. Internal issues are
              handled as per our Damage Policy.
            </p>
          </section>

          {/* Section 20 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              20. How is damage assessed?
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Our team inspects returned products:</li>
              <li>Genuine issues = rental recalculated based on usage</li>
              <li>Invalid issues = full rental charges apply</li>
            </ul>
          </section>

          {/* Section 21 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              21. What if I face issues during my rental period?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Raise a service ticket at: <br />
              <a
                href="https://ezyshare.raiseaticket.com/support"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgb(13,148,136)" }}
              >
                🔗 https://ezyshare.raiseaticket.com/support
              </a>
            </p>
          </section>

          {/* Section 22 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              22. How do I avoid damage charges?
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Follow the setup guide carefully</li>
              <li>Don’t force any connections or ports</li>
              <li>Report any issue before attempting fixes</li>
            </ul>
          </section>

          {/* Section 23 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              23. How does Ezys ensure product quality?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              All products go through thorough testing and cleaning before every
              rental.
            </p>
          </section>

          {/* Section 24 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              24. Is my personal data secure?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Yes. We use SSL encryption, and your payment data is handled by
              secure gateways like Razorpay.
            </p>
          </section>

          {/* Section 25 */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)",
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left",
              }}
            >
              25. I’m new to gaming/VR. Can I still rent?
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Absolutely! You’ll receive a Quick Start Guide with your product
              to help you get started.
            </p>
          </section>
        </main>
      </div>
    </main>
  );
};

export default FAQ;
