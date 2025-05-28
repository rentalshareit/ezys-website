import {
  ADD_QTY_ITEM,
  ADD_TO_BASKET,
  CLEAR_BASKET,
  UPDATE_RENTAL_PERIOD,
  MINUS_QTY_ITEM,
  REMOVE_FROM_BASKET,
  SET_BASKET_ITEMS,
  UPDATE_AVAILABLE_TAG_ITEMS,
} from "@/constants/constants";

const getDefaultDate = () => [
  new Date(),
  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
];

const getDefaultPeriod = () => {
  const date = getDefaultDate();
  return {
    dates: [date[0].toLocaleDateString(), date[1].toLocaleDateString()],
    days: Math.floor(Math.abs(date[1] - date[0]) / (1000 * 60 * 60 * 24)),
  };
};

export default (state = [], action) => {
  switch (action.type) {
    case SET_BASKET_ITEMS:
      return (
        action.payload
          ?.filter((p) => p.tags)
          .map((product) => ({
            ...product,
            period: getDefaultPeriod(),
          })) || []
      );
    // Ensure the period is set correctly when loading from persisted state
    // This is to handle the case when the basket is loaded from local storage or server
    case ADD_TO_BASKET:
      if (state.some((product) => product.id === action.payload.id))
        return state;
      let period;
      if (state.length) {
        period = state[0].period;
      } else {
        period = getDefaultPeriod();
      }
      return [{ ...action.payload, period }, ...state];
    case UPDATE_AVAILABLE_TAG_ITEMS:
      return state.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            availableTagItems: action.payload.availableTagItems,
          };
        }
        return product;
      });
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
