/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import classNames from "classnames";
import { Flex } from "antd";
import PropType from "prop-types";
import React from "react";

const ProductShowcase = ({ products, skeletonCount, showAll }) => (
  <div
    className={classNames("product-showcase-grid", { "show-less": !showAll })}
  >
    {products.length === 0
      ? new Array(skeletonCount).fill({}).map((product, index) => (
          <FeaturedProduct
            // eslint-disable-next-line react/no-array-index-key
            key={`product-skeleton ${index}`}
            product={product}
          />
        ))
      : products.map((product) => (
          <FeaturedProduct key={product.id} product={product} />
        ))}
  </div>
);

ProductShowcase.defaultProps = {
  skeletonCount: 4,
  showAll: true,
};

ProductShowcase.propTypes = {
  products: PropType.array.isRequired,
  skeletonCount: PropType.number,
};

export default ProductShowcase;
