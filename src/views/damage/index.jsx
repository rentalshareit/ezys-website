import React from "react";

const Damage = () => {
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
            Damage Policy
          </h1>
          <p
            style={{
              fontSize: "1.125rem", // text-lg
            }}
          >
            At Ezys, we understand that accidents can happen. This policy
            outlines how we handle damaged rental items to ensure fairness and
            clarity for everyone.
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
              1. If You Receive a Damaged Item
            </h2>
            <p
              style={{
                marginBottom: "1rem", // mb-4
                lineHeight: "1.625", // leading-relaxed
              }}
            >
              Please inspect your rented item immediately upon delivery. If you
              notice any damage, report it within 4 hours of receiving the item.
              You can reach us via WhatsApp, email, or phone.
            </p>
          </section>
          {/* Section 2: Damage Assessment */}
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
              🛠️ Damage Assessment
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Once we receive your report, our team will assess the issue based
              on:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>The type of damage (external vs internal)</li>
              <li>The timing of the report</li>
              <li>Any safety or usage guidelines followed</li>
            </ul>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We'll be transparent throughout the process and may request
              photos, videos, or additional details.
            </p>
          </section>

          {/* Section 3: External Damage */}
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
              🔹 External Damage
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              You are responsible for any physical damage caused during the
              rental period—like dents, scratches, broken buttons, or parts.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Please handle all items with care and follow basic safety
              instructions.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              If external damage is found, repair or replacement costs will
              apply, and we’ll inform you before proceeding.
            </p>
          </section>

          {/* Section 4: Internal Damage */}
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
              🔸 Internal Damage
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              If the item stops working due to regular usage, we’ll take full
              responsibility.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              However, if there is evidence of tampering or misuse, the customer
              will be liable for the damage.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Internal issues not caused by the user will be repaired or
              replaced by Ezys at no cost to you.
            </p>
          </section>

          {/* Section 5: What We Expect From You */}
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
              🧾 What We Expect From You
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              To avoid damages, please:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>Follow usage instructions provided at the time of rental</li>
              <li>Store and operate items in a safe environment</li>
              <li>
                Avoid opening, tampering with, or attempting to repair the
                equipment yourself
              </li>
            </ul>
          </section>

          {/* Section 6: Charges for Damage */}
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
              💰 Charges for Damage
            </h2>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>
                <strong>External Damage:</strong> Charges apply if the product
                is returned with visible damage beyond normal wear and tear.
              </li>
              <li>
                <strong>Internal Damage:</strong> Charges apply only if misuse
                or neglect is confirmed.
              </li>
            </ul>
          </section>

          {/* Section 7: How We Resolve It */}
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
              ✅ How We Resolve It
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Depending on the situation, Ezys will offer one of the following:
            </p>
            <ul
              style={{
                marginBottom: "1rem",
                paddingLeft: "1.5rem",
                lineHeight: "1.625",
              }}
            >
              <li>
                Replacement – If the item is severely damaged and unusable.
              </li>
              <li>Repair – For minor damage, we’ll restore the item.</li>
              <li>
                Compensation – In select cases, we may offer partial refunds or
                discounts based on the issue.
              </li>
            </ul>
          </section>

          {/* Section 8: Disputes & Clarifications */}
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
              🤝 Disputes & Clarifications
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              Not happy with our damage assessment? No problem. You can raise a
              concern with our support team. We’re here to listen and resolve
              things fairly.
            </p>
          </section>

          {/* Section 9: Our Commitment to Quality */}
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
              🛡️ Our Commitment to Quality
            </h2>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We check every item thoroughly before and after each rental. Your
              feedback helps us improve and continue delivering the best
              experience.
            </p>
            <p style={{ marginBottom: "1rem", lineHeight: "1.625" }}>
              We appreciate your support in maintaining our rental items and
              reporting issues promptly. Our aim is to resolve concerns smoothly
              so you can enjoy the Ezys experience stress-free.
            </p>
          </section>
        </main>
      </div>
    </main>
  );
};

export default Damage;
