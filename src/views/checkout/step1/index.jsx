import { ArrowRightOutlined, ShopOutlined } from "@ant-design/icons";
import { BasketItem } from "@/components/basket";
import { CHECKOUT_STEP_2 } from "@/constants/routes";
import { displayMoney } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";

const OrderSummary = ({ basket, subtotal }) => {
  useDocumentTitle("Check Out Step 1 | Ezys");
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();
  const onClickPrevious = () => history.push("/");
  const onClickNext = () =>
    history.push(CHECKOUT_STEP_2, {
      fromAction: true,
    });

  return (
    <div className="checkout">
      <StepTracker current={1} />
      <div className="checkout-step-1">
        <h4 className="text-center">Order Summary</h4>
        <br />
        <div className="checkout-items">
          {basket.map((product) => (
            <BasketItem
              basket={basket}
              dispatch={dispatch}
              key={product.id}
              rentalPeriod={product.period.days}
              product={product}
              isAvailable
            />
          ))}
        </div>
        <br />
        <div className="basket-total text-right">
          <p className="basket-total-title">Subtotal:</p>
          <p className="basket-total-amount">{displayMoney(subtotal)}</p>
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
            onClick={onClickPrevious}
            type="button"
          >
            <ShopOutlined />
            &nbsp; Continue Shopping
          </button>
          <button
            className="button button-small"
            onClick={onClickNext}
            type="submit"
          >
            Next Step &nbsp;
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  basket: PropType.arrayOf(PropType.object).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(OrderSummary);
