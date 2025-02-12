/* eslint-disable max-len */
import { BasketItem, BasketToggle } from "@/components/basket";
import { Boundary, Modal, SignIn } from "@/components/common";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import firebase from "@/services/firebase";
import "rsuite/styles/index.less";
import { DateRangePicker } from "rsuite";
import moment from "moment";
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
    moment(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    ).add("days", 1),
    moment(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    ).add("days", 31),
  ]);
  const [show, setShow] = useState(false);
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { combine, allowedMaxDays, before } = DateRangePicker;
  const { basket, user, authStatus } = useSelector((state) => ({
    basket: state.basket,
    user: state.auth,
    authStatus: state.app.authStatus,
  }));
  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();

  const getRentalPeriod = useCallback(
    () => Math.abs(date[1].diff(date[0], "days")),
    [date]
  );

  const onDateChange = (arg) => {
    if (!datesAreOnSameDay(arg[0], arg[1])) {
      setDate(
        arg.map((a) =>
          moment(
            new Date(a).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
          )
        )
      );
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
        dates: [date[0].format("DD/MM/YYYY"), date[1].format("DD/MM/YYYY")],
        days: getRentalPeriod(),
      })
    );
  }, [date]);

  useEffect(() => {
    if (authStatus?.success && show) {
      setShow(false);
    }
  }, [authStatus]);

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
          <p>You must sign in to continue checking out</p>
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
              <>
                <DateRangePicker
                  value={date.map((d) => d.toDate())}
                  onChange={onDateChange}
                  label="Select Rental Period"
                  showOneCalendar
                  showHeader={false}
                  ranges={[]}
                  shouldDisableDate={combine(
                    allowedMaxDays(30),
                    before(
                      moment(
                        new Date().toLocaleString("en-US", {
                          timeZone: "Asia/Kolkata",
                        })
                      )
                        .add("days", 1)
                        .toDate()
                    )
                  )}
                />
                <span className="rental-duration">
                  Rental Duration: {getRentalPeriod()} Days
                </span>
              </>
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
