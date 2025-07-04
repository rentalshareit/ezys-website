import { ImageLoader } from "@/components/common";
import { Badge, Button, Card } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import PropType from "prop-types";
import { useBasket } from "@/hooks";
import React, { useCallback, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import ProductPrice from "./ProductPrice";

const ProductFeatured = ({ product }) => {
  const { skeleton = false } = product;
  const [showPrice, setShowPrice] = useState(false);
  const { addToBasket, isItemOnBasket } = useBasket();
  const history = useHistory();

  const onClickItem = useCallback(() => {
    if (!product || skeleton) return;
    history.push(`/product/${product.id}`);
  }, []);

  const onAddToBasket = useCallback(
    (e) => {
      e.stopPropagation();
      addToBasket(product);
    },
    [product, addToBasket]
  );

  const onViewPriceClick = useCallback((e) => {
    e.stopPropagation();
    setShowPrice(true);
  }, []);

  const isItemAlreadyInBasket = isItemOnBasket(product.id);

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
          actions={[
            skeleton ? (
              <Skeleton style={{ width: "100px", lineHeight: "30px" }} />
            ) : (
              <Button
                id={`btn-add-basket-${product.category}-${product.id}`}
                type={isItemAlreadyInBasket ? "default" : "primary"}
                onClick={onAddToBasket}
              >
                {isItemAlreadyInBasket ? "Remove From Basket" : "Add To Basket"}
              </Button>
            ),
            skeleton ? (
              <Skeleton style={{ width: "100px", lineHeight: "30px" }} />
            ) : (
              <Button
                id={`btn-view-price-${product.category}-${product.id}`}
                type="primary"
                onClick={onViewPriceClick}
              >
                View Price
              </Button>
            ),
          ]}
          cover={
            skeleton ? (
              <Skeleton style={{ width: "100%", height: "280px" }} />
            ) : (
              <img
                src={product.image}
                style={{ width: "100%", height: "280px", objectFit: "contain" }}
              />
            )
          }
        >
          <Card.Meta
            title={skeleton ? <Skeleton /> : product.name}
            description={
              skeleton ? <Skeleton style={{ width: "20%" }} /> : product.brand
            }
          />
        </Card>
      </Badge>
      <ProductPrice
        product={product}
        onClose={() => setShowPrice(false)}
        showPrice={showPrice}
      />
    </div>
  );
};

ProductFeatured.propTypes = {
  product: PropType.shape({
    image: PropType.string,
    name: PropType.string,
    id: PropType.string,
    brand: PropType.string,
  }).isRequired,
};

export default ProductFeatured;
