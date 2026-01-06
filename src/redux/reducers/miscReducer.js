import dayjs, { formatDate } from "@/helpers/dayjs";
import {
  IS_AUTHENTICATING,
  LOADING,
  SET_AUTH_STATUS,
  SET_REQUEST_STATUS,
  UPDATE_TOUR_STATUS,
  UPDATE_RENTAL_PERIOD,
  SHOW_SUBSCRIPTION_DISCLAIMER_MODAL,
  DISCLAIMER_CONFIRMED,
  DISCLAIMER_CANCELLED,
  HIDE_OOS_PRODUCTS,
} from "@/constants/constants";

const getDefaultRangeDate = () => [
  formatDate(dayjs().add(1, "day")),
  formatDate(dayjs().add(8, "day")),
];

const initState = {
  loading: false,
  isAuthenticating: false,
  authStatus: null,
  requestStatus: null,
  theme: "light",
  tour: {
    home: false,
    productCategory: false,
  },
  rentalPeriod: {
    dates: getDefaultRangeDate(),
    days: 7,
  },
  subscriptionDisclaimerModal: { visible: false },
  hideOutOfStock: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case IS_AUTHENTICATING:
      return {
        ...state,
        isAuthenticating: action.payload,
      };
    case SET_REQUEST_STATUS:
      return {
        ...state,
        requestStatus: action.payload,
      };
    case SET_AUTH_STATUS:
      return {
        ...state,
        authStatus: action.payload,
      };
    case UPDATE_TOUR_STATUS:
      // If action.payload is defined but does not have a page, reset the tour state if status is false
      if (action.payload && !action.payload.page) {
        if (action.payload.status === false) {
          return {
            ...state,
            tour: {},
          };
        }
        return state;
      }
      return {
        ...state,
        tour: {
          ...state.tour,
          [action.payload.page]: action.payload.status,
        },
      };
    case UPDATE_RENTAL_PERIOD:
      return {
        ...state,
        rentalPeriod: {
          dates: action.payload.dates,
          days: action.payload.days,
        },
      };
    case SHOW_SUBSCRIPTION_DISCLAIMER_MODAL:
      return {
        ...state,
        subscriptionDisclaimerModal: {
          visible: true,
          product: action.payload.product,
        },
      };
    case HIDE_OOS_PRODUCTS:
      return {
        ...state,
        hideOutOfStock: action.payload.hideOutOfStock,
      };
    case DISCLAIMER_CONFIRMED:
    case DISCLAIMER_CANCELLED:
      return { ...state, subscriptionDisclaimerModal: { visible: false } };
    default:
      return state;
  }
};
