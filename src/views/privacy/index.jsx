import React from "react";

const Privacy = () => {
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
            🔒 Privacy Policy
          </h1>
          <p
            style={{
              fontSize: "1.125rem", // text-lg
            }}
          >
            At Ezys, we deeply value your trust and are committed to
            safeguarding your privacy. This Privacy Policy explains how we
            collect, use, share, and protect your personal information when you
            use our rental services.
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
              1. Information We Collect
            </h2>
            <p
              style={{
                marginBottom: "1rem", // mb-4
                lineHeight: "1.625", // leading-relaxed
              }}
            >
              When you sign up or place an order on Ezys, we may collect the
              following personal details:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Mobile Number</li>
              <li>Delivery Address</li>
              <li>Government-issued ID (for KYC verification)</li>
            </ul>
            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
              }}
            >
              To confirm your order, you are required to complete the Know Your
              Customer (KYC) process. This is done by visiting the “My Orders”
              section within your Ezys account. Our platform will then verify
              your identity and submitted documents before proceeding with your
              order.
            </p>
          </section>
          {/* Section 2: Use of Cookies */}
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
              2. Use of Cookies
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We use cookies to:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Enhance your experience on our website</li>
              <li>Understand browsing behavior for service improvement</li>
              <li>Offer personalized promotions and content</li>
            </ul>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Cookies do not store personally identifiable information unless
              you have explicitly provided consent. You can manage or disable
              cookies via your browser settings at any time.
            </p>
          </section>

          {/* Section 3: Sharing of Information */}
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
              3. Sharing of Information
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We do not sell or rent your personal information.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We may share limited data with:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>
                Trusted service providers for delivery, payment processing,
                analytics, or technical support
              </li>
              <li>Legal authorities, if required by law</li>
              <li>
                Aggregated or anonymized data for performance analysis or
                marketing trends (not linked to any individual identity)
              </li>
            </ul>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              All data sharing is limited to what is necessary to operate and
              improve our services.
            </p>
          </section>

          {/* Section 4: Data Retention & User Rights */}
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
              4. Data Retention &amp; User Rights
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              You have full rights to:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Access your personal information</li>
              <li>Request corrections or updates</li>
              <li>
                Request deletion of your data (subject to legal or operational
                requirements)
              </li>
            </ul>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We retain your data only as long as necessary to fulfill the
              purpose for which it was collected or as mandated by applicable
              laws.
            </p>
            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
                fontWeight: "600",
              }}
            >
              Important:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>
                KYC-related documents are automatically deleted from our system
                after the order is completed.
              </li>
              <li>
                To exercise your data rights, please email us at{" "}
                <a href="mailto:contact@ezyshare.in">contact@ezyshare.in</a>.
              </li>
            </ul>
          </section>

          {/* Section 5: International Data Transfers */}
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
              5. International Data Transfers
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              In limited cases, your data may be transferred or processed
              outside India. We ensure that such transfers are compliant with
              relevant data protection regulations and are appropriately
              secured.
            </p>
          </section>

          {/* Section 6: Security Measures */}
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
              6. Security Measures
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We implement strong safeguards to protect your data:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>
                All transactions are protected using 128-bit SSL encryption
              </li>
              <li>
                Our systems follow strict access controls and regular security
                reviews
              </li>
              <li>
                KYC documents are encrypted and stored only during the
                validation window
              </li>
            </ul>
          </section>

          {/* Section 7: Payment Gateway Security */}
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
              7. Payment Gateway Security
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              All payments are processed through PCI-DSS-compliant third-party
              providers such as Razorpay. Ezys does not store any card details
              or payment credentials on its servers and is not liable for issues
              arising from third-party gateways.
            </p>
          </section>

          {/* Section 8: Consent & Updates */}
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
              8. Consent &amp; Updates
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              By using our platform and services, you consent to the terms of
              this Privacy Policy. We may update this policy periodically to
              reflect changes in legal, technical, or business needs. For any
              significant updates, users will be notified via email or through
              announcements on our platform.
            </p>
          </section>

          {/* Section 9: Contact Us */}
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
              9. Contact Us
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              If you have any questions, concerns, or requests related to this
              Privacy Policy or your personal data, please contact us:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>
                <span role="img" aria-label="email">
                  📧
                </span>{" "}
                Email:{" "}
                <a href="mailto:contact@ezyshare.in">contact@ezyshare.in</a>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </main>
  );
};

export default Privacy;
