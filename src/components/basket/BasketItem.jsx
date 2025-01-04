import { CloseOutlined } from "@ant-design/icons";
import { BasketItemControl } from "@/components/basket";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { removeFromBasket } from "@/redux/actions/basketActions";

const BasketItem = ({ product, rentalPeriod }) => {
  const dispatch = useDispatch();
  const onRemoveFromBasket = () => dispatch(removeFromBasket(product.id));

  return (
    <div className="basket-item">
      <BasketItemControl product={product} />
      <div className="basket-item-wrapper">
        <div className="basket-item-img-wrapper">
          <ImageLoader
            alt={product.name}
            className="basket-item-img"
            src={product.image}
          />
        </div>
        <div className="basket-item-details">
          <Link
            to={`/product/${product.id}`}
            onClick={() => document.body.classList.remove("is-basket-open")}
          >
            <p className="basket-item-name">{product.name}</p>
          </Link>
          <div className="basket-item-specs">
            <span className="spec-title">Quantity: {product.quantity}</span>
          </div>
        </div>
        <div className="basket-item-price">
          <p className="my-0">
            {displayMoney(
              parseInt(product.price[rentalPeriod - 1]) * product.quantity
            )}
          </p>
        </div>
        <button
          className="basket-item-remove button button-border button-border-gray button-small"
          onClick={onRemoveFromBasket}
          type="button"
        >
          <CloseOutlined />
        </button>
      </div>
    </div>
  );
};

BasketItem.propTypes = {
  product: PropType.shape({
    id: PropType.string,
    name: PropType.string,
    brand: PropType.string,
    price: PropType.number,
    quantity: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    selectedSize: PropType.string,
    selectedColor: PropType.string,
    imageCollection: PropType.arrayOf(PropType.string),
    sizes: PropType.arrayOf(PropType.number),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string),
  }).isRequired,
  rentalPeriod: PropType.number,
};

export default BasketItem;
