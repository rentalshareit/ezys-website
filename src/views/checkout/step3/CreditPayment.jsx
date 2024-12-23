/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-else-return */
import { CustomInput } from "@/components/formik";
import { Field, useFormikContext } from "formik";
import React, { useEffect, useRef } from "react";

const CreditPayment = () => {
  const { values, setValues } = useFormikContext();
  const collapseContainerRef = useRef(null);
  const cardInputRef = useRef(null);
  const containerRef = useRef(null);
  const checkboxContainerRef = useRef(null);

  const toggleCollapse = () => {
    const cn = containerRef.current;
    const cb = checkboxContainerRef.current;
    const cl = collapseContainerRef.current;

    if (cb && cn && cl) {
      if (values.type === "credit") {
        cardInputRef.current.focus();
        cn.style.height = `${cb.offsetHeight + cl.offsetHeight}px`;
      } else {
        cardInputRef.current.blur();
        cn.style.height = `${cb.offsetHeight}px`;
      }
    }
  };

  useEffect(() => {
    toggleCollapse();
  }, [values.type]);

  const onCreditModeChange = (e) => {
    if (e.target.checked) {
      setValues({ ...values, type: "credit" });
      toggleCollapse();
    }
  };

  const handleOnlyNumberInput = (e) => {
    const { key } = e.nativeEvent;
    if (/\D/.test(key) && key !== "Backspace") {
      e.preventDefault();
    }
  };

  return (
    <>
      <h4 className="text-center">Payment</h4>
      <div
        ref={containerRef}
        className={`checkout-fieldset-collapse ${
          values.type === "credit" ? "is-selected-payment" : ""
        }`}
      >
        {/* ---- CHECKBOX TOGGLER ------ */}
        <div className="checkout-field margin-0">
          <div className="checkout-checkbox-field" ref={checkboxContainerRef}>
            <input
              checked={values.type === "credit"}
              id="modeCredit"
              name="type" // the field name in formik I used is type
              onChange={onCreditModeChange}
              type="radio"
            />
            <label className="d-flex w-100" htmlFor="modeCredit">
              <div className="d-flex-grow-1 margin-left-s">
                <h4 className="margin-0">Pay Now</h4>
                <span className="text-subtle d-block margin-top-s">
                  Pay with Visa, Master Card and other debit or credit card, UPI
                  or NetBanking
                </span>
              </div>
              <div className="d-flex">
                <div className="payment-img payment-img-visa" />
                &nbsp;
                <div className="payment-img payment-img-mastercard" />
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditPayment;
