/* eslint-disable max-len */
import { BasketItem, BasketToggle } from "@/components/basket";
import { Boundary, Modal, SignIn } from "@/components/common";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import firebase from "@/services/firebase";
import { calculateTotal, displayMoney } from "@/helpers/utils";
import { useDidMount, useModal } from "@/hooks";
import useProductAvailability from "@/hooks/useProductAvailability";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { clearBasket } from "@/redux/actions/basketActions";

const Basket = () => {
  const [show, setShow] = useState(false);
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { isProductAvailable, getAvailableSlots } = useProductAvailability();
  const { basket, user, authStatus, rentalPeriod } = useSelector((state) => ({
    basket: state.basket,
    user: state.auth,
    authStatus: state.app.authStatus,
    rentalPeriod: state.app.rentalPeriod,
  }));

  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();

  useEffect(() => {
    if (didMount && firebase.auth.currentUser) {
      const clonedBasket = basket.map((obj) => {
        // Create a shallow copy of the object
        const newObj = { ...obj };
        delete newObj.availableTagItems;
        return newObj;
      });
      firebase
        .saveBasketItems(clonedBasket, firebase.auth.currentUser.uid)
        .then(() => {
          console.log("Item saved to basket");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [basket.length]);

  useEffect(() => {
    if (authStatus?.success && show) {
      setShow(false);
    }
  }, [authStatus]);

  const onCheckOut = () => {
    if (basket.length !== 0 && user) {
      document.body.classList.remove("is-basket-open");
      history.push(CHECKOUT_STEP_1, {
        fromAction: true,
      });
    } else {
      onOpenModal();
    }
  };

  const isAnyItemOutOfStock = useMemo(
    () =>
      basket.some((item) => !isProductAvailable(item, ...rentalPeriod.dates)),
    [basket, isProductAvailable, rentalPeriod]
  );

  const isItemOutOfStock = useCallback(
    (item) => !isProductAvailable(item, ...rentalPeriod.dates),
    [isProductAvailable, rentalPeriod]
  );

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
              <h3 className="basket-header-title">My Cart</h3>
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
            {basket.map((product, i) => (
              <BasketItem
                // eslint-disable-next-line react/no-array-index-key
                key={`${product.id}_${i}`}
                product={product}
                isItemOutOfStock={isItemOutOfStock}
              />
            ))}
          </div>

          <div className="basket-checkout">
            <div>
              {basket.length > 0 && (
                <div className="basket-rental-period">
                  <span className="basket-rental-period-title">
                    Rental Period:
                  </span>
                  &nbsp;
                  {rentalPeriod.dates[0]} {" to "}
                  {rentalPeriod.dates[1]} ({rentalPeriod.days} days)
                </div>
              )}
              <div className="basket-total">
                <span className="basket-total-title">Subtotal Amout:</span>
                <h4 className="basket-total-amount">
                  {calculateTotal(basket, rentalPeriod.days, true)}
                </h4>
              </div>
            </div>
            <div style={{ flexShrink: 0, flexGrow: 0 }}>
              <button
                className="button-small basket-checkout-button button"
                disabled={
                  basket.length === 0 ||
                  pathname === "/checkout" ||
                  isAnyItemOutOfStock
                }
                onClick={onCheckOut}
                type="button"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </Boundary>
      <SignIn
        show={show}
        onClose={() => {
          window.confirmationResult = null; // Clear confirmation result
          setShow(false);
        }}
      />
    </>
  );
};

export default Basket;
