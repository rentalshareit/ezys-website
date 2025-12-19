// create a reducer to handle coupon updates in the basket
import { UPDATE_COUPON } from "@/constants/constants";

const initialState = {
  code: "",
  discount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COUPON:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
