import { ImageLoader } from "@/components/common";
import { Badge, Button, Card } from "antd";
import PropType from "prop-types";
import React, { useCallback, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import ProductPrice from "./ProductPrice";

const ProductFeatured = ({ product }) => {
  const [showPrice, setShowPrice] = useState(false);
  const history = useHistory();

  const onClickItem = useCallback(() => {
    if (!product) return;
    history.push(`/product/${product.id}`);
  }, []);

  const onViewPriceClick = useCallback((e) => {
    e.stopPropagation();
    setShowPrice(true);
  }, []);

  return (
    <div style={{ marginTop: "10px" }}>
      <Badge
        color="rgb(228, 165, 31)"
        style={{ fontSize: "1.2rem", fontWeight: 800 }}
        count={product.discount ? `${product.discount}% off` : 0}
      >
        <Card
          id={`card-view-product-details-${product.category}-${product.id}`}
          hoverable
          variant="borderless"
          loading={!product?.image}
          onClick={onClickItem}
          style={{
            width: 240,
            height: 420,
            display: "flex",
            padding: "5px",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          size="small"
          actions={[
            <Button
              id={`btn-view-price-${product.category}-${product.id}`}
              className="button-view-price"
              onClick={onViewPriceClick}
            >
              View Price
            </Button>,
          ]}
          cover={
            <img
              src={product.image}
              style={{ width: "100%", height: "280px", objectFit: "contain" }}
            />
          }
        >
          <Card.Meta title={product.name} description={product.brand} />
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
