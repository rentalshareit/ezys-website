/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import classNames from "classnames";
import { Flex } from "antd";
import PropType from "prop-types";
import React from "react";
import { calculateElementsThatFit } from "@/helpers/utils";

const ProductShowcase = ({ products, skeletonCount, showAll }) => {
  let productsToShow = products;
  if (products.length) {
    if (!showAll) {
      const elementsThatFit = calculateElementsThatFit(240, 5, 5, 0, 0, 80);
      productsToShow = products.slice(0, elementsThatFit);
    }
  }
  return (
    <div className={classNames("product-showcase-grid")}>
      {productsToShow.length === 0
        ? new Array(skeletonCount).fill({}).map((product, index) => (
            <FeaturedProduct
              // eslint-disable-next-line react/no-array-index-key
              key={`product-skeleton ${index}`}
              product={product}
            />
          ))
        : productsToShow.map((product) => (
            <FeaturedProduct key={product.id} product={product} />
          ))}
    </div>
  );
};

ProductShowcase.defaultProps = {
  skeletonCount: 4,
  showAll: true,
};

ProductShowcase.propTypes = {
  products: PropType.array.isRequired,
  skeletonCount: PropType.number,
};

export default ProductShowcase;
