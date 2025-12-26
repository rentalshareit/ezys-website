import { useDispatch, useSelector } from "react-redux";
import { App } from "antd";
import {
  addToBasket as dispatchAddToBasket,
  removeFromBasket,
} from "@/redux/actions/basketActions";

const useBasket = () => {
  const { notification } = App.useApp();
  const { basket } = useSelector((state) => ({ basket: state.basket }));
  const dispatch = useDispatch();

  const isItemOnBasket = (id) => !!basket.find((item) => item.id === id);

  const addToBasket = (product) => {
    if (isItemOnBasket(product.id)) {
      dispatch(removeFromBasket(product.id));
    } else {
      dispatch(dispatchAddToBasket(product));
    }
  };

  return { basket, isItemOnBasket, addToBasket };
};

export default useBasket;
