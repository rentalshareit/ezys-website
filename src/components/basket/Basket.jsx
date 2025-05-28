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
import { set } from "date-fns";

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

  const [itemsAvailable, setItemsAvailable] = useState([]);
  const [show, setShow] = useState(false);
  const { isOpenModal, onOpenModal, onCloseModal } = useModal();
  const { combine, allowedMaxDays, before, after } = DateRangePicker;
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

  useEffect(async () => {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbxlC2R1EPoKBW65eSoy31fZUbZgMI1prYuG77P5C2guSvUj26bRtKT--JccFVQz5vw/exec?action=getCurrentAvailability`
    );
    const data = await response.json();
    setItemsAvailable(data);
  }, []);

  useEffect(() => {
    if (didMount && firebase.auth.currentUser && basket.length !== 0) {
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
      history.push(CHECKOUT_STEP_1, {
        fromAction: true,
      });
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

  const getTagItemsForProducts = useCallback(
    (product) => {
      const { tags } = product;
      const tagsItems = tags.map((tag) => {
        const tagItemsAvailable = itemsAvailable.filter(
          (item) => item.type === tag
        );
        const tagItem = tagItemsAvailable.find((availableItem) => {
          return availableItem.availability.some(([start, end]) => {
            const rentalStart = date[0].toDate();
            const rentalEnd = date[1].toDate();

            return (
              moment(start, "DD/MM/YYYY").toDate() <= rentalStart &&
              moment(end, "DD/MM/YYYY").toDate() >= rentalEnd
            );
          });
        });
        return tagItem;
      });

      return tagsItems;
    },
    [date, itemsAvailable]
  );

  const isAnyItemOutOfStock = useMemo(() => {
    return basket.some((product) =>
      getTagItemsForProducts(product).some((item) => !item)
    );
  }, [basket, getTagItemsForProducts]);

  const getAvailableSlots = useCallback(
    (product) => {
      const { tags } = product;

      const allTagsIntervals = tags.map((tag) => {
        const tagItemsAvailable = itemsAvailable.filter(
          (item) => item.type === tag
        );
        const mergedIntervals = tagItemsAvailable
          .flatMap((availableItem) => availableItem.availability)
          .map(([start, end]) => ({
            start: moment(start, "DD/MM/YYYY").toDate(),
            end: moment(end, "DD/MM/YYYY").toDate(),
          }))
          .sort((a, b) => a.start - b.start)
          .reduce((merged, current) => {
            const last = merged[merged.length - 1];
            if (!last || current.start > last.end) {
              merged.push(current);
            } else if (current.end <= last.end) {
              // Skip the current interval as it is fully covered by the last interval
              return merged;
            } else {
              merged.push(current);
            }
            return merged;
          }, [])
          .map(({ start, end }) => [
            moment(start).format("DD/MM/YYYY"),
            moment(end).format("DD/MM/YYYY"),
          ]);

        return mergedIntervals;
      });

      const commonIntervals = allTagsIntervals.reduce((common, intervals) => {
        if (!common.length) return intervals;

        return common
          .map(([commonStart, commonEnd]) => {
            return intervals
              .map(([start, end]) => {
                const overlapStart = moment.max(
                  moment(commonStart, "DD/MM/YYYY"),
                  moment(start, "DD/MM/YYYY")
                );
                const overlapEnd = moment.min(
                  moment(commonEnd, "DD/MM/YYYY"),
                  moment(end, "DD/MM/YYYY")
                );

                if (
                  overlapStart.isBefore(overlapEnd) ||
                  overlapStart.isSame(overlapEnd)
                ) {
                  return [
                    overlapStart.format("DD/MM/YYYY"),
                    overlapEnd.format("DD/MM/YYYY"),
                  ];
                }
                return null;
              })
              .filter(Boolean);
          })
          .flat();
      }, []);

      if (!commonIntervals.length) {
        return "No available slots for next 2 months. Please check back later.";
      }

      return commonIntervals
        .map(
          ([start, end]) =>
            `${moment(start, "DD/MM/YYYY").format("DD MMM")} - ${moment(
              end,
              "DD/MM/YYYY"
            ).format("DD MMM")}`
        )
        .join(", ");
    },
    [itemsAvailable]
  );

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
                  editable={false}
                  shouldDisableDate={combine(
                    combine(
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
                    ),
                    after(
                      moment(
                        new Date().toLocaleString("en-US", {
                          timeZone: "Asia/Kolkata",
                        })
                      )
                        .add("days", 61)
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
                rentalPeriod={getRentalPeriod()}
                getTagItemsForProducts={getTagItemsForProducts}
                getAvailableSlots={getAvailableSlots}
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
      </Boundary>
      <SignIn show={show} onClose={() => setShow(false)} />
    </>
  );
};

export default Basket;
