/* eslint-disable max-len */
import { BasketItem, BasketToggle } from "@/components/basket";
import { Boundary, Modal, SignIn } from "@/components/common";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import firebase from "firebase/firebase";
import "rsuite/styles/index.less";
import { DateRangePicker } from "rsuite";
import { calculateTotal, displayMoney } from "@/helpers/utils";
import { useDidMount, useModal } from "@/hooks";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { clearBasket, updateRentalPeriod } from "@/redux/actions/basketActions";

const datesAreOnSameDay = (first, second) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const Basket = () => {
  const [date, setDate] = useState([
    new Date(),
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  ]);
  const [show, setShow] = useState(false);
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

  const getRentalPeriod = useCallback(
    () => Math.floor(Math.abs(date[1] - date[0]) / (1000 * 60 * 60 * 24)),
    [date]
  );

  const onDateChange = (arg) => {
    if (!datesAreOnSameDay(arg[0], arg[1])) {
      setDate(arg);
    }
  };

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

  useEffect(() => {
    dispatch(
      updateRentalPeriod({
        dates: [date[0], date[1]],
        days: getRentalPeriod(),
      })
    );
  }, [date]);

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
    setShow(true);
  };

  const onClearBasket = () => {
    if (basket.length !== 0) {
      dispatch(clearBasket());
    }
  };

  return (
    <>
      <Boundary>
        <Modal isOpen={isOpenModal} onRequestClose={onCloseModal}>
          <p className="text-center">
            You must sign in to continue checking out
          </p>
          <br />
          <div className="d-flex">
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
                onChange={onDateChange}
                placeholder="Select Rental Period"
                showOneCalendar
                showHeader={false}
                ranges={[]}
                shouldDisableDate={combine(allowedMaxDays(31), beforeToday())}
              />
            )}
            {basket.map((product, i) => (
              <BasketItem
                // eslint-disable-next-line react/no-array-index-key
                key={`${product.id}_${i}`}
                product={product}
                basket={basket}
                rentalPeriod={getRentalPeriod()}
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
                        parseInt(product.price[getRentalPeriod() - 1]) *
                        product.quantity
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
      <SignIn show={show} onClose={() => setShow(false)} />
    </>
  );
};

export default Basket;
