import React, { useCallback, useMemo } from "react";
import PropType from "prop-types";
import { Badge, Button, Card } from "antd";
import ProductAvailability from "./ProductAvailability";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useBasket } from "@/hooks";
import useProductAvailability from "@/hooks/useProductAvailability";
import { calculateProductPrice } from "@/helpers/utils";
import ProductSkeleton from "./ProductSkeleton";
import {
  priceContainerStyles,
  priceStyles,
  daysTextStyles,
} from "./ProductFeatured.styles";

const ProductActionButton = ({
  isOutOfStock,
  isInBasket,
  onClick,
  product,
}) => {
  const { id: productId, category } = product;
  const getButtonType = () => {
    if (isOutOfStock || isInBasket) {
      return "default";
    }
    return "primary";
  };

  const getButtonText = () => {
    if (isOutOfStock) {
      return "Out Of Stock";
    }
    if (isInBasket) {
      return "Remove From Cart";
    }
    return "Add To Cart";
  };

  return (
    <Button
      id={`btn-add-basket-${category}-${productId}`}
      disabled={isOutOfStock}
      type={getButtonType()}
      onClick={onClick}
    >
      {getButtonText()}
    </Button>
  );
};

const ProductPrice = ({ original, days, discounted }) => (
  <div style={priceContainerStyles}>
    {original !== discounted ? (
      <>
        <span
          style={{
            ...priceStyles,
            textDecoration: "line-through",
            color: "#999",
          }}
        >
          {original}
        </span>
        <span style={{ ...priceStyles, paddingLeft: "0.5rem" }}>
          {discounted}
        </span>
      </>
    ) : (
      <span style={priceStyles}>{original}</span>
    )}
    <br />
    <span style={daysTextStyles}>{`for ${days} days`}</span>
  </div>
);

const ProductCardContent = ({
  product,
  isOutOfStock,
  isLoading,
  rentalPeriod,
}) => (
  <img
    src={product.image}
    style={{ width: "100%", height: "280px", objectFit: "contain" }}
    alt={product.name}
  />
);

const getDiscountBadgeText = (discount) => {
  if (!discount) return 0;
  return `${discount}% off`;
};

const getCardActions = ({
  isOutOfStock,
  isInBasket,
  onAddToBasket,
  product,
  original,
  rentalPeriod,
  discounted,
}) => {
  return [
    <ProductActionButton
      key="action"
      isOutOfStock={isOutOfStock}
      isInBasket={isInBasket}
      onClick={onAddToBasket}
      product={product}
    />,
    isOutOfStock ? (
      <ProductAvailability key="availability" product={product} />
    ) : (
      <ProductPrice
        key="price"
        original={original}
        discounted={discounted}
        days={rentalPeriod.days}
      />
    ),
  ];
};

const ProductFeatured = ({ product }) => {
  const { skeleton = false } = product;
  const { addToBasket, isItemOnBasket } = useBasket();
  const { isProductAvailable, isLoading } = useProductAvailability();
  const history = useHistory();
  const { rentalPeriod } = useSelector((state) => ({
    rentalPeriod: state.app.rentalPeriod,
  }));

  const onClickItem = useCallback(() => {
    if (!product || skeleton) return;
    history.push(`/product/${product.id}`);
  }, [product, skeleton, history]);

  const isItemAlreadyInBasket = isItemOnBasket(product.id);

  const isItemOutOfStock = useMemo(() => {
    if (product.skeleton) {
      return false;
    }
    return !isProductAvailable(product, ...rentalPeriod.dates);
  }, [isProductAvailable, product, rentalPeriod]);

  const onAddToBasket = useCallback(
    (e) => {
      e.stopPropagation();
      addToBasket(product);
    },
    [product, addToBasket]
  );

  const [original, discounted] = calculateProductPrice(
    product,
    rentalPeriod.days,
    true
  );

  if (skeleton || isLoading) {
    return <ProductSkeleton />;
  }

  return (
    <div>
      <Badge
        color="rgb(228, 165, 31)"
        style={{ fontSize: "1.2rem", fontWeight: 800 }}
        count={product.discount ? `${product.discount}% off` : 0}
      >
        <Card
          id={`card-view-product-details-${product.category}-${product.id}`}
          hoverable
          variant="borderless"
          onClick={onClickItem}
          style={{
            width: 280,
            height: 420,
            display: "flex",
            padding: "5px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          size="small"
          actions={getCardActions({
            isOutOfStock: isItemOutOfStock,
            isInBasket: isItemAlreadyInBasket,
            onAddToBasket: onAddToBasket,
            product,
            original,
            rentalPeriod,
            discounted,
          })}
          cover={
            <ProductCardContent
              product={product}
              isOutOfStock={isItemOutOfStock}
              isLoading={isLoading}
              rentalPeriod={rentalPeriod}
            />
          }
        >
          <Card.Meta title={product.name} description={product.brand} />
        </Card>
      </Badge>
    </div>
  );
};

ProductFeatured.propTypes = {
  product: PropType.shape({
    image: PropType.string,
    name: PropType.string,
    id: PropType.string,
    brand: PropType.string,
    category: PropType.string,
    discount: PropType.number,
    skeleton: PropType.bool,
  }).isRequired,
};

export default ProductFeatured;
