import PropType from "prop-types";

const BasketToggle = ({ children }) => {
  const onClickToggle = () => {
    if (document.body.classList.contains("is-basket-open")) {
      document.body.classList.remove("is-basket-open");
    } else {
      document.body.classList.add("is-basket-open");
    }
  };

  document.addEventListener("click", (e) => {
    const closest = e.target.closest(".basket");
    const datePicker = e.target.closest(".rs-picker-popup");
    const datePickerWorkaround = Array.from(e.target.classList).some((c) =>
      c?.startsWith("rs-calendar")
    );
    const toggle = e.target.closest(".basket-toggle");
    const closeToggle = e.target.closest(".basket-item-remove");

    if (
      !closest &&
      !datePicker &&
      !datePickerWorkaround &&
      document.body.classList.contains("is-basket-open") &&
      !toggle &&
      !closeToggle
    ) {
      console.log(
        "test",
        closest,
        datePicker,
        toggle,
        closeToggle,
        e.target,
        e,
        datePickerWorkaround
      );
      document.body.classList.remove("is-basket-open");
    }
  });

  return children({ onClickToggle });
};

BasketToggle.propTypes = {
  children: PropType.oneOfType([
    PropType.arrayOf(PropType.node),
    PropType.func,
    PropType.node,
  ]).isRequired,
};

export default BasketToggle;
