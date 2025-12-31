import {
  IS_AUTHENTICATING,
  LOADING,
  SET_AUTH_STATUS,
  SET_REQUEST_STATUS,
  UPDATE_TOUR_STATUS,
  UPDATE_RENTAL_PERIOD,
  SHOW_PLUS_DISCLAIMER_MODAL,
  DISCLAIMER_CONFIRMED,
  DISCLAIMER_CANCELLED,
  HIDE_OOS_PRODUCTS,
} from "@/constants/constants";

export const setLoading = (bool = true) => ({
  type: LOADING,
  payload: bool,
});

export const setAuthenticating = (bool = true) => ({
  type: IS_AUTHENTICATING,
  payload: bool,
});

export const setRequestStatus = (status) => ({
  type: SET_REQUEST_STATUS,
  payload: status,
});

export const setAuthStatus = (status = null) => ({
  type: SET_AUTH_STATUS,
  payload: status,
});

export const updateTourStatus = (payload) => ({
  type: UPDATE_TOUR_STATUS,
  payload,
});

export const updateRentalPeriod = (payload) => ({
  type: UPDATE_RENTAL_PERIOD,
  payload,
});

export const hideOOSProducts = (payload) => ({
  type: HIDE_OOS_PRODUCTS,
  payload,
});

export const showDisclaimerModal = (product, pendingAction) => ({
  type: SHOW_PLUS_DISCLAIMER_MODAL,
  payload: { product, pendingAction },
});

export const confirmDisclaimer = () => ({ type: DISCLAIMER_CONFIRMED });
export const cancelDisclaimer = () => ({ type: DISCLAIMER_CANCELLED });
