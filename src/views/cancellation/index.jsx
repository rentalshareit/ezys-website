import React from "react";

const Cancellation = () => {
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
            Cancellation & Refund Policy
          </h1>
          <p
            style={{
              fontSize: "1.125rem", // text-lg
            }}
          >
            At Ezys, we understand that sometimes plans change. Our Cancellation
            & Refund Policy is designed to balance customer flexibility with
            operational fairness.
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
              1. Free Cancellations – Before Shipping
            </h2>
            <p
              style={{
                marginBottom: "1rem", // mb-4
                lineHeight: "1.625", // leading-relaxed
              }}
            >
              You may cancel your rental order at no cost if the request is made
              before the item is shipped.
            </p>
            <p style={{ lineHeight: "1.625" }}>
              We recommend reaching out to us as early as possible for
              hassle-free processing.
            </p>
          </section>

          {/* Section 2: Cancellations – After Shipping */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)", // Changed primary color
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left", // Added for left alignment
              }}
            >
              2. Cancellations – After Shipping
            </h2>
            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              If you cancel after the product has been shipped but before it is
              delivered, a shipping charge will apply.
            </p>
            <p style={{ lineHeight: "1.625" }}>
              The cancellation fee will reflect the actual cost of shipping and
              will be deducted from your refund (if applicable).
            </p>
          </section>

          {/* Section 3: No Cancellations – After Delivery */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)", // Changed primary color
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left", // Added for left alignment
              }}
            >
              3. No Cancellations – After Delivery
            </h2>
            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              Once the rental item is delivered and accepted, no cancellations
              or refunds will be processed.
            </p>
            <p style={{ lineHeight: "1.625" }}>
              We advise customers to inspect the item upon delivery and report
              any issues within 24 hours.
            </p>
          </section>

          {/* Section 4: Refund Processing */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)", // Changed primary color
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left", // Added for left alignment
              }}
            >
              4. Refund Processing
            </h2>
            <p
              style={{
                marginBottom: "1rem", // mb-4
                lineHeight: "1.625", // leading-relaxed
              }}
            >
              In case of an approved refund, we aim to initiate the refund
              within 5–7 working days directly to your original payment method.
            </p>
            <p style={{ lineHeight: "1.625" }}>
              Refund timelines may vary based on your bank or payment provider.
            </p>
          </section>

          {/* Section 5: How to Cancel an Order */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)", // Changed primary color
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left", // Added for left alignment
              }}
            >
              5. How to Cancel an Order
            </h2>
            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              To cancel, please email, message or call our customer service team
              with your:
            </p>
            <ul
              style={{
                listStyleType: "disc",
                marginLeft: "2.25rem", // ml-4 (combining with default list-inside margin)
                paddingLeft: "0",
                color: "#4b5563",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <li>Order number</li>
              <li>Registered name or phone number</li>
              <li>Reason for cancellation</li>
            </ul>
            <p
              style={{
                marginTop: "1rem", // mt-4
                lineHeight: "1.625",
              }}
            >
              Prompt and complete information will help us resolve your request
              faster.
            </p>
          </section>

          {/* Section 6: Exceptions */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)", // Changed primary color
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left", // Added for left alignment
              }}
            >
              6. Exceptions
            </h2>
            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              If we are unable to fulfill your order due to product
              unavailability or logistical constraints, we will cancel your
              order and issue a full refund.
            </p>
            <p style={{ lineHeight: "1.625" }}>
              For any extenuating circumstances, we encourage you to contact us.
              We will review each case individually to find a fair resolution.
            </p>
          </section>

          {/* Section 7: Policy Updates */}
          <section>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "rgb(13,148,136)", // Changed primary color
                marginBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "0.5rem",
                textAlign: "left", // Added for left alignment
              }}
            >
              7. Policy Updates
            </h2>
            <p style={{ lineHeight: "1.625" }}>
              Ezys reserves the right to modify or update this policy at any
              time. Any significant changes will be reflected on this page and,
              when appropriate, communicated via email.
            </p>
            <p
              style={{
                marginTop: "1rem", // mt-4
                fontSize: "0.875rem", // text-sm
                color: "#6b7280", // gray-500
              }}
            >
              Last updated: July 11, 2025
            </p>
          </section>
        </main>
      </div>
    </main>
  );
};

export default Cancellation;
