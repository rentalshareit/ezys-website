import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Collapse, Card, Input, Button, Alert } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { updateCoupon } from "@/redux/actions/basketActions";

const { Panel } = Collapse;

function cleanAndEncodeMobile(userId) {
  // Remove +91 or 91 prefix (handles variations like space or no space)
  let cleanId = userId.replace(/^\+?91\s?/, "");
  // Encode for URL safety (handles special chars if any)
  return encodeURIComponent(cleanId);
}

const Coupons = ({ cartItems, onApplyingChange }, ref) => {
  const [coupons, setCoupons] = useState([]);
  const [manualCoupon, setManualCoupon] = useState("");
  const { code: appliedCouponCode, discount: appliedDiscount } = useSelector(
    (store) => store.coupon,
  );
  const [showCongrats, setShowCongrats] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const { profile } = useSelector((store) => ({
    profile: store.profile,
  }));

  const userId = profile?.mobile?.value ? profile.mobile.value : "guest";

  const fetchCoupons = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbxlC2R1EPoKBW65eSoy31fZUbZgMI1prYuG77P5C2guSvUj26bRtKT--JccFVQz5vw/exec?action=getCoupons&userId=" +
          cleanAndEncodeMobile(userId),
      );
      const { coupons: c = [] } = await response.json();
      return c.map((coupon) => ({
        code: coupon.Code,
        description: coupon.Description,
        expiry: coupon.Expiry,
      }));
    } catch (error) {
      console.error("Failed to fetch coupons:", error);
      return [];
    }
  };

  const redeemCoupon = async (couponCode) => {
    if (!cartItems || cartItems.length === 0) {
      return Promise.reject({
        success: false,
        error: "Your cart is empty.",
      });
    }

    try {
      const response = await fetch("/api/redeem-coupon", {
        method: "POST",
        headers: {
          "X-Api-Key": "API_KEY",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "redeemCoupon",
          code: couponCode,
          mode: "preview",
          userId: cleanAndEncodeMobile(userId),
          cartItems,
        }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: "Failed to redeem coupon. Please try again.",
      };
    }
  };

  useEffect(() => {
    const loadCoupons = async () => {
      const fetchedCoupons = await fetchCoupons();
      setCoupons(fetchedCoupons);
    };
    loadCoupons();
  }, [userId]);

  useEffect(() => {
    if (appliedCouponCode && appliedDiscount > 0) {
      setShowCongrats(true);
      const t = setTimeout(() => setShowCongrats(false), 3000);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [appliedCouponCode, appliedDiscount]);

  const applyOrRemoveCoupon = async (code, manual = false) => {
    if (isApplying) return;

    if (!manual) setManualCoupon("");
    setErrorMsg("");
    setIsApplying(true);
    onApplyingChange?.(true);

    try {
      if (appliedCouponCode === code) {
        // remove
        dispatch(
          updateCoupon({
            code: "",
            discount: 0,
          }),
        );
      } else {
        const response = await redeemCoupon(code);
        if (response.success) {
          dispatch(
            updateCoupon({
              code,
              discount: response.response?.discount || 0,
            }),
          );
        } else {
          console.error("Failed to apply coupon:", response.error);
          setErrorMsg(response.error || "Coupon is not valid for this cart.");
        }
      }
    } finally {
      setIsApplying(false);
      onApplyingChange?.(false);
    }
  };

  const handleManualCouponApply = () => {
    if (!manualCoupon.trim() || isApplying) return;
    applyOrRemoveCoupon(manualCoupon.trim(), true);
  };

  // EXPOSE IMPERATIVE API
  useImperativeHandle(ref, () => ({
    async recomputeDiscount() {
      if (!appliedCouponCode) return;
      // re-preview for current cartItems
      const response = await redeemCoupon(appliedCouponCode);
      if (response.success) {
        dispatch(
          updateCoupon({
            code: appliedCouponCode,
            discount: response.response?.discount || 0,
          }),
        );
        setErrorMsg("");
      } else {
        // clear coupon if no longer valid
        dispatch(
          updateCoupon({
            code: "",
            discount: 0,
          }),
        );
        setErrorMsg(response.error || "Coupon no longer valid for this cart.");
      }
    },
  }));

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  return (
    <div className="coupons-container">
      <Collapse>
        <Panel header="Apply Coupon" key="1">
          <div className="manual-coupon">
            <Input
              placeholder="Enter coupon code"
              value={manualCoupon}
              onChange={(e) => setManualCoupon(e.target.value)}
              style={{ marginBottom: "16px", borderRadius: "8px" }}
              disabled={isApplying}
            />
            <Button
              type="primary"
              onClick={handleManualCouponApply}
              style={{ borderRadius: "8px" }}
              disabled={isApplying}
            >
              {manualCoupon && isApplying
                ? "Applying..."
                : manualCoupon && appliedCouponCode === manualCoupon.trim()
                  ? "Remove"
                  : "Apply"}
            </Button>
          </div>

          {errorMsg && (
            <div style={{ marginBottom: 12 }}>
              <Alert
                type="error"
                message={errorMsg}
                showIcon
                onClose={() => setErrorMsg("")}
              />
            </div>
          )}

          {appliedCouponCode && appliedDiscount > 0 && (
            <div
              style={{
                marginBottom: 12,
                padding: 8,
                borderRadius: 8,
                background: "#ecfdf3",
                color: "#166534",
                fontSize: 12,
              }}
            >
              🎉 Applied coupon <strong>{appliedCouponCode}</strong>, discount:
              ₹{appliedDiscount}
            </div>
          )}

          {coupons.length === 0 && (
            <div
              style={{
                padding: "10px 0",
                textAlign: "center",
                color: "#818181",
                fontSize: 13,
              }}
            >
              No coupons available right now.
            </div>
          )}

          <div className="coupons-list">
            {coupons.map((coupon) => {
              const isApplied = appliedCouponCode === coupon.code;
              return (
                <Card
                  key={coupon.code}
                  className="coupon-card"
                  style={{
                    marginBottom: "16px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    padding: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="coupon-left">
                    <h4
                      style={{
                        marginBottom: "8px",
                        marginTop: 0,
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {coupon.code}
                    </h4>
                    <p
                      style={{
                        marginBottom: "4px",
                        fontSize: "12px",
                        color: "#555",
                      }}
                    >
                      {coupon.description}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#888",
                      }}
                    >
                      Expiry: {formatDate(coupon.expiry)}
                    </p>
                    {isApplied && (
                      <p
                        style={{
                          marginTop: 4,
                          fontSize: "12px",
                          color: "#166534",
                          fontWeight: 500,
                        }}
                      >
                        Applied to this cart
                      </p>
                    )}
                  </div>
                  <div className="coupon-right">
                    <Button
                      type={isApplied ? "default" : "primary"}
                      size="middle"
                      onClick={() => applyOrRemoveCoupon(coupon.code)}
                      disabled={isApplying}
                      style={{
                        backgroundColor: isApplied
                          ? "#fff"
                          : "rgb(13, 148, 136)",
                        borderColor: "rgb(13, 148, 136)",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        color: isApplied ? "rgb(13, 148, 136)" : "#fff",
                      }}
                    >
                      {isApplying
                        ? "Applying..."
                        : isApplied
                          ? "Remove"
                          : "Apply"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Panel>
      </Collapse>

      {showCongrats && appliedCouponCode && appliedDiscount > 0 && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowCongrats(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: "32px 24px",
              maxWidth: 320,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
              animation: "pop-in 0.25s ease-out",
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 22,
                fontWeight: 700,
                color: "rgb(13, 148, 136)",
              }}
            >
              Hurray! 🎉
            </h2>
            <p
              style={{
                margin: 0,
                marginBottom: 4,
                fontSize: 14,
                color: "rgb(9,103,95)",
              }}
            >
              Your coupon has been applied.
            </p>
            <p
              style={{
                margin: 0,
                marginTop: 8,
                fontSize: 18,
                fontWeight: 600,
                color: "rgb(13, 148, 136)",
              }}
            >
              You just saved ₹{appliedDiscount}
            </p>
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowCongrats(false);
              }}
              style={{
                marginTop: 20,
                borderRadius: 999,
                backgroundColor: "rgb(13, 148, 136)",
                borderColor: "rgb(13, 148, 136)",
                paddingInline: 28,
                fontWeight: 600,
              }}
            >
              Awesome
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

Coupons.propTypes = {
  cartItems: PropTypes.array.isRequired,
  onApplyingChange: PropTypes.func,
};

// wrap with forwardRef
export default forwardRef(Coupons);
