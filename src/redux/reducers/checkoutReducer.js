import {
  RESET_CHECKOUT,
  SET_CHECKOUT_PAYMENT_DETAILS,
  SET_CHECKOUT_SHIPPING_DETAILS,
  UPDATE_MISC_CHARGES,
} from "@/constants/constants";

const defaultState = {
  shipping: {},
  payment: {
    type: "payondelivery",
    tncAccepted: false,
  },
  miscCharges: {
    shippingCharges: null,
    packagingCharges: 0,
    discount: 0,
    total: null,
  },
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_CHECKOUT_SHIPPING_DETAILS:
      return {
        ...state,
        shipping: action.payload,
      };
    case SET_CHECKOUT_PAYMENT_DETAILS:
      return {
        ...state,
        payment: action.payload,
      };
    case UPDATE_MISC_CHARGES:
      return {
        ...state,
        miscCharges: {
          ...state.miscCharges,
          ...action.payload,
        },
      };
    case RESET_CHECKOUT:
      return defaultState;
    default:
      return state;
  }
};
