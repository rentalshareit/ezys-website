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
      notification.info({
        message: "Item removed from basket",
      });
    } else {
      dispatch(dispatchAddToBasket(product));
      notification.success({
        message: "Item added to basket",
      });
    }
  };

  return { basket, isItemOnBasket, addToBasket };
};

export default useBasket;
