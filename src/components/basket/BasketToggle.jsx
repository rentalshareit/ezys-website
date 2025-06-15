import React, { useEffect, useCallback } from "react";
import PropType from "prop-types";
import { Tour } from "antd";
import { useSelector } from "react-redux";
import { useTour } from "@/hooks";

const steps = [
  {
    title: "Change your rental period",
    description:
      "Click here to change the rental period of your items. It will open a calendar to select the rental start and end dates. Press 'Ok' to apply the changes.",
    target: () => document.querySelector("[id=drpicker-rental-period]"),
  },
];

const BasketToggle = ({ children }) => {
  const { basket } = useSelector((state) => ({
    basket: state.basket,
  }));
  const [basketVisible, setBasketVisible] = React.useState(false);
  const tourProps = useTour(
    "basket",
    steps,
    () => !!basketVisible && !!basket?.length,
    [basketVisible, basket?.length],
    500
  );
  const onClickToggle = useCallback(() => {
    if (document.body.classList.contains("is-basket-open")) {
      setBasketVisible(false);
    } else {
      setBasketVisible(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      const closest = e.target.closest(".basket");
      const datePicker = e.target.closest(".rs-picker-popup");
      const antTour = e.target.closest(".ant-tour");
      const datePickerWorkaround = Array.from(e.target.classList).some((c) =>
        c?.startsWith("rs-calendar")
      );
      const toggle = e.target.closest(".basket-toggle");
      const closeToggle = e.target.closest(".basket-item-remove");

      if (
        !closest &&
        !datePicker &&
        !antTour &&
        !datePickerWorkaround &&
        document.body.classList.contains("is-basket-open") &&
        !toggle &&
        !closeToggle
      ) {
        setBasketVisible(false);
      }
    });
  }, []);

  useEffect(() => {
    if (basketVisible) {
      document.body.classList.add("is-basket-open");
    } else {
      document.body.classList.remove("is-basket-open");
    }
  }, [basketVisible]);

  return (
    <>
      <Tour {...tourProps} />
      {children({ onClickToggle })}
    </>
  );
};

BasketToggle.propTypes = {
  children: PropType.oneOfType([
    PropType.arrayOf(PropType.node),
    PropType.func,
    PropType.node,
  ]).isRequired,
};

export default BasketToggle;
