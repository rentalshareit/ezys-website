import React from "react";

const Terms = () => {
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
            📄 Terms & Conditions
          </h1>
          <p
            style={{
              fontSize: "1.125rem", // text-lg
            }}
          >
            Welcome to Ezys. By accessing or using our website and rental
            services, you agree to the following Terms & Conditions. Please read
            them carefully before placing an order or browsing the platform.
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
              1. Acceptance of Terms
            </h2>
            <p
              style={{
                marginBottom: "1rem", // mb-4
                lineHeight: "1.625", // leading-relaxed
              }}
            >
              By using the Ezys website ("Site"), you agree to comply with these
              Terms & Conditions. If you do not agree, please do not use the
              Site or our services.
            </p>
          </section>

          {/* Section 2: Use of the Site */}
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
              2. Use of the Site
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              The Site is intended for personal, non-commercial use. You agree
              not to use the platform for any unlawful purposes or in violation
              of these Terms.
            </p>
          </section>

          {/* Section 3: Website Content */}
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
              3. Website Content
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              All content displayed on this website—text, visuals, layout,
              etc.—is intended solely for informative and functional use by Ezys
              customers. Unauthorized reproduction, misuse, or scraping of
              content is discouraged.
            </p>
          </section>

          {/* Section 4: User Content */}
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
              4. User Content
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              By submitting reviews, feedback, or any content to the Site, you
              grant Ezys the right to use and display such content for
              marketing, support, and operational purposes.
            </p>
          </section>

          {/* Section 5: Privacy Policy */}
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
              5. Privacy Policy
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Use of the Site is also governed by our Privacy Policy, which
              details how we collect, store, and use your personal data.
            </p>
          </section>

          {/* Section 6: Minimum Age Requirement */}
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
              6. Minimum Age Requirement
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              You must be 21 years or older to rent from Ezys. All rentals
              require KYC verification using a valid government-issued ID.
            </p>
          </section>

          {/* Section 7: Rental Duration & Extensions */}
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
              7. Rental Duration & Extensions
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Rental durations range from 1 to 30 days.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Only one extension is permitted per order and must be requested
              before the rental period ends.
            </p>
          </section>

          {/* Section 8: Return Obligations */}
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
              8. Return Obligations
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              All rented items must be returned on or before the agreed return
              date shared in your confirmation message. Failure to return items
              without communication will be treated as a breach of contract.
            </p>
          </section>

          {/* Section 9: Consequences of Non-Response */}
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
              9. Consequences of Non-Response
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
                paddingLeft: "1.5rem",
              }}
            >
              <li>Ezys may issue formal notices</li>
              <li>
                Legal action may be initiated, including filing a police
                complaint or FIR
              </li>
            </ul>
          </section>

          {/* Section 10: Legal Action & Cost Recovery */}
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
              10. Legal Action & Cost Recovery
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
                paddingLeft: "1.5rem",
              }}
            >
              <li>Pursue legal recovery of items or compensation</li>
              <li>
                Claim damages, operational losses, transportation fees, and
                legal expenses
              </li>
            </ul>
          </section>

          {/* Section 11: Issue Reporting & Inspection */}
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
              11. Issue Reporting & Inspection
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              If you face any issues during the rental period:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
                paddingLeft: "1.5rem",
              }}
            >
              <li>
                <strong>Genuine Issues:</strong> If validated upon inspection,
                the rental fee will be recalculated based on the number of days
                the item was used.
                <br />
                <em>Example:</em> If an issue is reported on Day 6 of a 10-day
                rental, you’ll be charged the 5-day per-day rate, and the
                balance refunded.
              </li>
              <li>
                <strong>Invalid Issues:</strong> If no issue is found, the
                original rental charges apply based on the full duration.
              </li>
            </ul>
          </section>
          {/* Section 12: Refund Policy */}
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
              12. Refund Policy
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Approved refunds will be processed within 5–7 working days after
              the item has been returned and inspected.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Refunds are limited to the amount paid for that rental and do not
              cover indirect losses.
            </p>
          </section>

          {/* Section 13: Disclaimer of Warranties */}
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
              13. Disclaimer of Warranties
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              The Ezys platform is provided “as is.” We do not guarantee
              uninterrupted service or freedom from errors.
            </p>
          </section>

          {/* Section 14: Limitation of Liability */}
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
              14. Limitation of Liability
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                lineHeight: "1.625",
                paddingLeft: "1.5rem",
              }}
            >
              <li>Indirect, incidental, or consequential damages</li>
              <li>Any claims beyond the value of the rental fee paid</li>
            </ul>
          </section>

          {/* Section 15: Governing Law & Jurisdiction */}
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
              15. Governing Law & Jurisdiction
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              These Terms shall be governed by the laws of Hyderabad, India. All
              disputes are subject to the exclusive jurisdiction of the courts
              in Hyderabad.
            </p>
          </section>

          {/* Section 16: Changes to Terms */}
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
              16. Changes to Terms
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Ezys may update these Terms without prior notice. Continued use of
              the Site after such changes indicates your acceptance of the
              updated Terms.
            </p>
          </section>

          {/* Contact Us */}
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
              📬 Contact Us
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Have questions? Reach out anytime at{" "}
              <a
                href="mailto:contact@ezyshare.in"
                style={{
                  color: "rgb(13,148,136)",
                  textDecoration: "underline",
                }}
              >
                contact@ezyshare.in
              </a>{" "}
              — we're here to help.
            </p>
          </section>
        </main>
      </div>
    </main>
  );
};

export default Terms;
