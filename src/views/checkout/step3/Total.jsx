import {
  ArrowLeftOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useFormikContext } from "formik";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";

const Total = ({ subtotal, loading, onClickBack, valid }) => {
  const { values, submitForm } = useFormikContext();

  return (
    <>
      <div className="basket-total text-right">
        <p className="basket-total-title">Total:</p>
        <h4 className="basket-total-amount">{displayMoney(subtotal)}</h4>
      </div>
      <br />
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
};

export default Total;
