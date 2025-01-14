/* eslint-disable no-nested-ternary */
import { calculateTotal } from "@/helpers/utils";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

const withCheckout = (Component) =>
  withRouter((props) => {
    const state = useSelector((store) => ({
      isAuth: !!store.auth.id && !!store.auth.role,
      basket: store.basket,
      shipping: store.checkout.shipping,
      payment: store.checkout.payment,
      profile: store.profile,
    }));

    const subtotal = calculateTotal(
      state.basket.map(
        (product) => product.price[product.period.days - 1] * product.quantity
      )
    );

    if (state.basket.length === 0) {
      return <Redirect to="/" />;
    }
    if (state.isAuth && state.basket.length !== 0) {
      return (
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
          basket={state.basket}
          payment={state.payment}
          shipping={state.shipping}
          profile={state.profile}
          subtotal={Number(subtotal)}
        />
      );
    }
    return null;
  });

export default withCheckout;
