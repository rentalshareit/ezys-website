import {
  IS_AUTHENTICATING,
  LOADING,
  SET_AUTH_STATUS,
  SET_REQUEST_STATUS,
  UPDATE_TOUR_STATUS,
} from "@/constants/constants";

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
    default:
      return state;
  }
};
