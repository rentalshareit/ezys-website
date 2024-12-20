import { ImageLoader } from "@/components/common";
import PropType from "prop-types";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";

const ProductFeatured = ({ product }) => {
  const history = useHistory();
  const onClickItem = () => {
    if (!product) return;

    history.push(`/product/${product.id}`);
  };

  return (
    <SkeletonTheme color="#e1e1e1" highlightColor="#f2f2f2">
      <div
        className="product-display"
        onClick={onClickItem}
        role="presentation"
      >
        <div className="product-display-img">
          {product.image ? (
            <ImageLoader className="product-card-img" src={product.image} />
          ) : (
            <Skeleton width="100%" height="100%" />
          )}
        </div>
        <div className="product-display-details">
          <p>{product.name || <Skeleton width={80} />}</p>
          <p className="text-subtle">
            {product.brand || <Skeleton width={40} />}
          </p>
        </div>
      </div>
    </SkeletonTheme>
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
