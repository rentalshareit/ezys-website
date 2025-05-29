/* eslint-disable no-nested-ternary */
import { calculateTotal } from "@/helpers/utils";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Redirect,
  withRouter,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useIdleRouteRedirect } from "@/hooks";

const withCheckout = (Component) =>
  withRouter((props) => {
    const location = useLocation();
    const history = useHistory();
    // Redirect to home if the user is idle for a certain period
    // and not coming from a basket checkout click
    useIdleRouteRedirect();

    useEffect(() => {
      if (location.state?.fromAction) window.history.replaceState({}, "");
      else history.replace("/");
    }, [location.state, history]);

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

    if (state.isAuth) {
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
