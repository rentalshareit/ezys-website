/* eslint-disable max-len */
import { BasketItem, BasketToggle } from "@/components/basket";
import {
  Boundary,
  Modal,
  SignIn,
  formatDateWithOrdinal,
} from "@/components/common";
import { Alert, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { CHECKOUT_STEP_1 } from "@/constants/routes";
import firebase from "@/services/firebase";
import { calculateTotal, displayMoney } from "@/helpers/utils";
import { useDidMount, useModal } from "@/hooks";
import useProductAvailability from "@/hooks/useProductAvailability";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { clearBasket } from "@/redux/actions/basketActions";
import { calculateProductPrice } from "@/helpers/utils";
import Coupons from "./Coupons";

const Basket = () => {
  const [show, setShow] = useState(false);
  const couponsRef = useRef(null);
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const [isCouponApplying, setIsCouponApplying] = useState(false);
  const { isProductAvailable, getAvailableSlots } = useProductAvailability();
  const { basket, user, authStatus, rentalPeriod, coupon } = useSelector(
    (state) => ({
      basket: state.basket,
      user: state.auth,
      authStatus: state.app.authStatus,
      rentalPeriod: state.app.rentalPeriod,
      coupon: state.coupon,
    })
  );

  const history = useHistory();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const didMount = useDidMount();

  const couponDiscountAmount = useMemo(() => {
    if (!coupon || !coupon.discount) return 0;
    const amount = Number(coupon.discount || 0);
    return amount;
  }, [coupon]);

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

  const cartItems = useMemo(() => {
    return basket.map((item) => {
      const [originalPrice, discountedPrice] = calculateProductPrice(
        item,
        rentalPeriod.days
      );
      return {
        name: item.name,
        qty: item.quantity,
        price: discountedPrice,
      };
    });
  }, [basket, rentalPeriod]);

  // Recompute discount whenever cartItems changes
  useEffect(() => {
    if (couponsRef.current?.recomputeDiscount) {
      couponsRef.current.recomputeDiscount();
    }
  }, [cartItems]);

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
            {basket.length > 0 && (
              <Alert
                style={{ marginBottom: "1rem" }}
                message={`Rental Period: ${formatDateWithOrdinal(
                  rentalPeriod.dates[0],
                  false
                )} - ${formatDateWithOrdinal(rentalPeriod.dates[1], false)} (${
                  rentalPeriod.days
                } days)`}
                className="alert-white-text"
                type="info"
                showIcon
                description="Click the icon to understand rental period."
                icon={
                  <Tooltip
                    title={
                      <div
                        style={{
                          color: "#fff",
                          textAlign: "left",
                          lineHeight: 1.5,
                        }}
                      >
                        We will deliver products at your address on{" "}
                        <strong>
                          {formatDateWithOrdinal(rentalPeriod.dates[0], false)}
                        </strong>
                        .
                        <br />
                        <br />
                        Pick up would be on{" "}
                        <strong>
                          {formatDateWithOrdinal(rentalPeriod.dates[1], false)}
                        </strong>
                        .
                        <br />
                        <br />
                        <small style={{ opacity: 0.9 }}>
                          You can choose delivery time slot at checkout.
                          <br />1 day = 24 hours from the time of delivery.
                        </small>
                      </div>
                    }
                    trigger="click"
                  >
                    <InfoCircleOutlined
                      style={{
                        color: "#fff",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    />
                  </Tooltip>
                }
              />
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
          <Coupons
            ref={couponsRef}
            cartItems={cartItems}
            onApplyingChange={setIsCouponApplying}
          />
          <div className="basket-checkout">
            <div className="basket-total">
              <span className="basket-total-title">Subtotal Amount:</span>
              <span className="basket-total-title-value">
                {calculateTotal(basket, rentalPeriod.days, true)}
              </span>
            </div>

            {couponDiscountAmount > 0 && (
              <>
                <div className="basket-total">
                  <span className="basket-total-title">
                    Coupon Discount{coupon?.code ? ` (${coupon.code})` : ""}:
                  </span>
                  <span
                    className="basket-total-title-value"
                    style={{
                      color: "#16a34a",
                    }}
                  >
                    - {displayMoney(couponDiscountAmount)}
                  </span>
                </div>
                <div className="basket-total">
                  <span className="basket-total-title">Net Payable:</span>
                  <span className="basket-total-title-value">
                    {displayMoney(
                      Math.max(
                        0,
                        calculateTotal(basket, rentalPeriod.days, false) -
                          couponDiscountAmount
                      )
                    )}
                  </span>
                </div>
              </>
            )}

            <div style={{ marginTop: "8px" }}>
              <button
                className="button-small basket-checkout-button button"
                disabled={
                  basket.length === 0 ||
                  pathname === "/checkout" ||
                  isAnyItemOutOfStock ||
                  isCouponApplying
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
