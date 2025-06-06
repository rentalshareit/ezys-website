/* eslint-disable jsx-a11y/label-has-associated-control */
import { useFormikContext } from "formik";
import React from "react";

const PayOnDelivery = () => {
  const { values, setValues } = useFormikContext();

  return (
    <div
      className={`checkout-fieldset-collapse ${
        values.type === "payondelivery" ? "is-selected-payment" : ""
      }`}
    >
      <div className="checkout-field margin-0">
        <div className="checkout-checkbox-field">
          <input
            checked={values.type === "payondelivery"}
            id="modePayPal"
            name="type"
            onChange={(e) => {
              if (e.target.checked) {
                setValues({ ...values, type: "payondelivery" });
              }
            }}
            type="radio"
          />
          <label className="d-flex w-100" htmlFor="modePayPal">
            <div className="d-flex-grow-1 margin-left-s">
              <h4 className="margin-0">Pay On Delivery</h4>
              <span className="text-subtle d-block margin-top-s">
                Pay after product gets delivered using UPI, netbanking or cards.
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PayOnDelivery;
