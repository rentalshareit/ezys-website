import {
  RESET_CHECKOUT,
  SET_CHECKOUT_PAYMENT_DETAILS,
  SET_CHECKOUT_SHIPPING_DETAILS,
  UPDATE_MISC_CHARGES,
} from "@/constants/constants";

export const setShippingDetails = (details) => ({
  type: SET_CHECKOUT_SHIPPING_DETAILS,
  payload: details,
});

export const setPaymentDetails = (details) => ({
  type: SET_CHECKOUT_PAYMENT_DETAILS,
  payload: details,
});

export const updateMiscCharges = (charges) => ({
  type: UPDATE_MISC_CHARGES,
  payload: charges,
});

export const resetCheckout = () => ({
  type: RESET_CHECKOUT,
});
