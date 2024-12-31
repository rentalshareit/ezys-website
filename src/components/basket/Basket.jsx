/* eslint-disable max-len */
import { BasketItem, BasketToggle } from "@/components/basket";
import { Boundary, Modal } from "@/components/common";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import firebase from "firebase/firebase";
import "rsuite/styles/index.less";
import { DateRangePicker } from "rsuite";
import { calculateTotal, displayMoney } from "@/helpers/utils";
import { useDidMount, useModal } from "@/hooks";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { clearBasket } from "@/redux/actions/basketActions";

const Basket = () => {
  const [date, setDate] = useState([
    new Date(),
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  ]);
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { combine, allowedMaxDays, beforeToday } = DateRangePicker;
  const { basket, user } = useSelector((state) => ({
    basket: state.basket,
    user: state.auth,
  }));
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();

  useEffect(() => {
    if (didMount && firebase.auth.currentUser && basket.length !== 0) {
      firebase
        .saveBasketItems(basket, firebase.auth.currentUser.uid)
        .then(() => {
          console.log("Item saved to basket");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [basket.length]);

  const onCheckOut = () => {
    if (basket.length !== 0 && user) {
      document.body.classList.remove("is-basket-open");
      history.push(CHECKOUT_STEP_1);
    } else {
      onOpenModal();
    }
  };

  const onSignInClick = () => {
    onCloseModal();
    document.body.classList.remove("basket-open");
    history.push(CHECKOUT_STEP_1);
  };

  const onClearBasket = () => {
    if (basket.length !== 0) {
      dispatch(clearBasket());
    }
  };

  const onRequestClose = (e) => {
    const datePickerPopup = document.querySelector(".rs-picker-popup");
  };

  const rentalPeriod = useMemo(() =>
    Math.floor(Math.abs(date[1] - date[0]) / (1000 * 60 * 60 * 24))
  );

  return user && user.role === "ADMIN" ? null : (
    <Boundary>
      <Modal isOpen={isOpenModal} onRequestClose={onRequestClose}>
        <p className="text-center">You must sign in to continue checking out</p>
        <br />
        <div className="d-flex-center">
          <button
            className="button button-border button-border-gray button-small"
            onClick={onCloseModal}
            type="button"
          >
            Continue shopping
          </button>
          &nbsp;
          <button
            className="button button-small"
            onClick={onSignInClick}
            type="button"
          >
            Sign in to checkout
          </button>
        </div>
      </Modal>
      <div className="basket">
        <div className="basket-list">
          <div className="basket-header">
            <h3 className="basket-header-title">My Basket</h3>
            <BasketToggle>
              {({ onClickToggle }) => (
                <button
                  className="basket-toggle button button-border button-border-gray button-small"
                  onClick={onClickToggle}
                  style={{ marginRight: "1rem" }}
                  type="button"
                >
                  <span>Close</span>
                </button>
              )}
            </BasketToggle>
            <button
              className="basket-clear button button-border button-border-gray button-small"
              disabled={basket.length === 0}
              onClick={onClearBasket}
              type="button"
            >
              <span>Clear Basket</span>
            </button>
          </div>
          {basket.length <= 0 && (
            <div className="basket-empty">
              <h5 className="basket-empty-msg">Your basket is empty</h5>
            </div>
          )}
          {basket.length > 0 && (
            <DateRangePicker
              value={date}
              onChange={setDate}
              placeholder="Select Rental Period"
              showHeader={false}
              shouldDisableDate={combine(allowedMaxDays(31), beforeToday())}
            />
          )}
          {basket.map((product, i) => (
            <BasketItem
              // eslint-disable-next-line react/no-array-index-key
              key={`${product.id}_${i}`}
              product={product}
              basket={basket}
              rentalPeriod={rentalPeriod}
              dispatch={dispatch}
            />
          ))}
        </div>
        <div className="basket-checkout">
          <div className="basket-total">
            <span className="basket-total-title">Subtotal Amout:</span>
            <h4 className="basket-total-amount">
              {displayMoney(
                calculateTotal(
                  basket.map(
                    (product) =>
                      parseInt(product.price[rentalPeriod]) * product.quantity
                  )
                )
              )}
            </h4>
          </div>
          <button
            className="button-small basket-checkout-button button"
            disabled={basket.length === 0 || pathname === "/checkout"}
            onClick={onCheckOut}
            type="button"
          >
            Check Out
          </button>
        </div>
      </div>
    </Boundary>
  );
};

export default Basket;
