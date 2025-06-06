import {
  ArrowLeftOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useFormikContext } from "formik";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";

const Total = ({ subtotal, loading, onClickBack, valid, miscCharges }) => {
  const { values, submitForm } = useFormikContext();

  return (
    <>
      <div className="basket-total text-right">
        <p className="basket-total-title">Total:</p>
        <h4 className="basket-total-amount">
          {displayMoney(Number(subtotal + (miscCharges?.shippingCharges || 0)))}
        </h4>
      </div>
      <div className="checkout-note-wrapper">
        <b>Note:</b>{" "}
        <span className="checkout-note">
          Avoid refreshing the page during checkout to prevent losing your
          progress.
        </span>
      </div>
      <div className="checkout-shipping-action">
        <button
          className="button button-muted button-small"
          disabled={loading}
          onClick={() => onClickBack(values)}
          type="button"
        >
          <ArrowLeftOutlined />
          &nbsp; Go Back
        </button>
        <button
          className="button button-small"
          disabled={loading || !valid}
          onClick={submitForm}
          type="button"
        >
          {loading ? <LoadingOutlined /> : <CheckOutlined />}
          &nbsp; Confirm
        </button>
      </div>
    </>
  );
};

Total.propTypes = {
  valid: PropType.bool.isRequired,
  onClickBack: PropType.func.isRequired,
  subtotal: PropType.number.isRequired,
  loading: PropType.bool.isRequired,
  miscCharges: PropType.shape({
    shippingCharges: PropType.number,
  }),
};

export default Total;
