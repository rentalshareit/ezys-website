import PropType from "prop-types";
import React from "react";

const StepTracker = ({ current }) => {
  // eslint-disable-next-line no-nested-ternary
  const className = (step) =>
    current === step ? "is-active-step" : step < current ? "is-done-step" : "";

  return (
    <div className="checkout-header">
      <ul className="checkout-header-menu">
        <li className={`checkout-header-list ${className(1)}`}>
          <div className="checkout-header-item">
            <div className="checkout-header-icon">
              <p className="checkout-header-step">1</p>
            </div>
            <p className="checkout-header-subtitle">Order Summary</p>
          </div>
        </li>
        <li className={`checkout-header-list ${className(2)}`}>
          <div className="checkout-header-item">
            <div className="checkout-header-icon">
              <p className="checkout-header-step">2</p>
            </div>
            <p className="checkout-header-subtitle">Shipping Details</p>
          </div>
        </li>
        <li className={`checkout-header-list ${className(3)}`}>
          <div className="checkout-header-item">
            <div className="checkout-header-icon">
              <p className="checkout-header-step">3</p>
            </div>
            <p className="checkout-header-subtitle">Payment</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

StepTracker.propTypes = {
  current: PropType.number.isRequired,
};

export default StepTracker;
