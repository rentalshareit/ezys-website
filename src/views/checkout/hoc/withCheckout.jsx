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
import { calculateProductPrice } from "@/helpers/utils";

const withCheckout = (Component) =>
  withRouter((props) => {
    const location = useLocation();
    const history = useHistory();
    const { rentalPeriod } = useSelector((state) => ({
      rentalPeriod: state.app.rentalPeriod,
    }));
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
      miscCharges: store.checkout.miscCharges,
      payment: store.checkout.payment,
      profile: store.profile,
    }));

    // Subtotal calculation does not include any discounts or offers or shipping charges
    const subtotal = calculateTotal(state?.basket, rentalPeriod.days);

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
          miscCharges={state.miscCharges}
          rentalPeriod={rentalPeriod}
        />
      );
    }
    return null;
  });

export default withCheckout;
