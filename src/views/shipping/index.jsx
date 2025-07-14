import React from "react";

const Shipping = () => {
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
            🚚 Shipping & Delivery Policy
          </h1>
          <p
            style={{
              fontSize: "1.125rem", // text-lg
            }}
          >
            At Ezys, we’re committed to delivering a smooth and transparent
            rental experience—from the moment you place an order to the day you
            return your device. This policy outlines everything you need to know
            about our shipping and delivery process.
          </p>
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
              1. Order Confirmation & Delivery Timing
            </h2>
            <p
              style={{
                marginBottom: "1rem", // mb-4
                lineHeight: "1.625", // leading-relaxed
              }}
            >
              While placing your order, you can select your preferred delivery
              date based on real-time product availability displayed on the
              website.
            </p>

            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              Shipping charges are applicable and vary based on the distance
              from our nearest warehouse—ranging from ₹99 to ₹299.
            </p>

            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              You'll also be able to choose a preferred time slot for delivery.
              While we make every effort to deliver within your selected time
              window, please note that exact delivery times cannot be guaranteed
              due to external factors.
            </p>

            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              After placing the order, you'll need to complete KYC submission.
              Once validated (which may take up to 6 hours), you’ll receive a
              final confirmation message
            </p>
          </section>
          {/* Section 2: Rental Duration */}
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
              2. Rental Duration
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              The minimum rental period is 1 day, and the maximum rental period
              is 30 days.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              As per our policy, only one rental extension is allowed. Please
              contact customer support for extension requests.
            </p>
          </section>

          {/* Section 3: Returns & Late Fees */}
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
              3. Returns & Late Fees
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Please return the product by the agreed-upon return date to avoid
              late return charges.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              If you require more time, kindly reach out to extend your
              rental—only one extension per rental is permitted.
            </p>
          </section>

          {/* Section 4: Delivery Protocol */}
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
              4. Delivery Protocol
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              For home deliveries, either you or an authorized representative
              must be available to receive and sign for the delivery. This
              ensures a secure and smooth handover.
            </p>
          </section>

          {/* Section 5: Damaged or Incorrect Items */}
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
              5. Damaged or Incorrect Items
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              If your rental item arrives in damaged condition or does not match
              the product description, notify us within 24 hours of delivery.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Our team will evaluate the issue and arrange a replacement or
              refund, depending on the situation.
            </p>
          </section>

          {/* Section 6: Rental Extensions */}
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
              6. Rental Extensions
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Need more time? You can request a one-time extension before the
              rental period ends. Simply contact our support team, and we’ll
              assist you with the updated charges and process.
            </p>
          </section>

          {/* Section 7: Cancellations */}
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
              7. Cancellations
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Cancellations made before shipping are eligible for a full refund.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              If the order is cancelled after shipping, shipping charges will
              apply.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              No refunds are issued once the delivery has been accepted. For
              more, refer to our{" "}
              <a
                href="/cancellation-policy"
                style={{
                  color: "rgb(13,148,136)",
                  textDecoration: "underline",
                }}
              >
                Cancellation Policy
              </a>
              .
            </p>
          </section>

          {/* Section 8: Product Quality & Assurance */}
          <section>
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
              8. Product Quality & Assurance
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              All rental items are owned and maintained by Ezys, and go through
              rigorous quality checks before each delivery to ensure
              functionality, cleanliness, and overall satisfaction.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We understand the excitement of trying out your favorite gadgets,
              and we work hard to make the rental process smooth, reliable, and
              transparent. If you have any questions or need help at any point,
              our customer support team is just a message away.
            </p>
            <p
              style={{
                lineHeight: "1.625",
                fontWeight: "500",
                color: "rgb(13,148,136)",
              }}
            >
              Thank you for choosing Ezys—where gaming meets flexibility.
            </p>
          </section>
        </main>
      </div>
    </main>
  );
};

export default Shipping;
