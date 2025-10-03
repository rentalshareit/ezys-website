import { CloseOutlined } from "@ant-design/icons";
import { BasketItemControl } from "@/components/basket";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Collapse } from "antd";
import {
  removeFromBasket,
  updateAvailableTagItems,
} from "@/redux/actions/basketActions";
import { calculateProductPrice } from "@/helpers/utils";

const BasketItem = ({
  product,
  rentalPeriod,
  getTagItemsForProducts,
  getAvailableSlots,
}) => {
  const dispatch = useDispatch();
  const onRemoveFromBasket = () => dispatch(removeFromBasket(product.id));

  const availableTagItems = useMemo(
    () => getTagItemsForProducts(product),
    [getTagItemsForProducts, product]
  );

  useEffect(() => {
    // This null is the case when you are on checkout page and same component is used.
    // If you are on checkout page, you don't want to update the available tag item as item is already selected.
    if (availableTagItems === null) return;

    const availableTagItemsProductCode = availableTagItems
      .map((item) => item?.productCode)
      .join(",");

    if (
      availableTagItemsProductCode !==
      product?.availableTagItems?.map((item) => item?.productCode).join(",")
    )
      dispatch(updateAvailableTagItems(product.id, availableTagItems));
  }, [availableTagItems, dispatch, product.id]);

  const availableSlots = useMemo(
    () => getAvailableSlots(product),
    [getAvailableSlots, product]
  );

  const [originalPrice, discountedPrice] = calculateProductPrice(
    product,
    rentalPeriod,
    true
  );

  return (
    <div className="basket-item">
      <div style={{ display: "flex", width: "100%" }}>
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
              {product.discount ? (
                <div className="basket-item-discount">
                  <strike>{originalPrice}</strike>
                  <span>{discountedPrice}</span>
                </div>
              ) : (
                originalPrice
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
      {availableTagItems?.some((item) => !item) && (
        <Collapse
          defaultActiveKey={["1"]}
          style={{ width: "100%" }}
          items={[
            {
              key: "1",
              label: (
                <p className="basket-item-error">
                  This item is out of stock for the selected dates.
                </p>
              ),
              children: (
                <>
                  <span>Available slots are:</span>
                  <p className="basket-item-availability">{availableSlots}</p>
                </>
              ),
            },
          ]}
        />
      )}
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
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string),
  }).isRequired,
  rentalPeriod: PropType.number,
  availableTagItems: PropType.arrayOf(PropType.any),
  getAvailableSlots: PropType.func,
};

BasketItem.DefaultProps = {
  getTagItemsForProducts: () => null,
  getAvailableSlots: () => {},
};

export default BasketItem;
