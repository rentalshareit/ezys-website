import {
  ADD_QTY_ITEM,
  ADD_TO_BASKET,
  CLEAR_BASKET,
  UPDATE_RENTAL_PERIOD,
  MINUS_QTY_ITEM,
  REMOVE_FROM_BASKET,
  SET_BASKET_ITEMS,
} from "@/constants/constants";

export default (state = [], action) => {
  switch (action.type) {
    case SET_BASKET_ITEMS:
      return action.payload;
    case ADD_TO_BASKET:
      if (state.some((product) => product.id === action.payload.id))
        return state;
      let period;
      if (state.length) {
        period = state[0].period;
      } else {
        const date = [
          new Date(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        ];
        period = {
          dates: [date[0].toLocaleDateString(), date[1].toLocaleDateString()],
          days: Math.floor(Math.abs(date[1] - date[0]) / (1000 * 60 * 60 * 24)),
        };
      }
      return [{ ...action.payload, period }, ...state];
    case REMOVE_FROM_BASKET:
      return state.filter((product) => product.id !== action.payload);
    case CLEAR_BASKET:
      return [];
    case ADD_QTY_ITEM:
      return state.map((product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });
    case MINUS_QTY_ITEM:
      return state.map((product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });
    case UPDATE_RENTAL_PERIOD:
      return state.map((product) => ({
        ...product,
        period: action.payload,
      }));
    default:
      return state;
  }
};
