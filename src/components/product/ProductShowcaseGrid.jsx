/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import classNames from "classnames";
import { Flex } from "antd";
import PropType from "prop-types";
import React from "react";
import { calculateElementsThatFit } from "@/helpers/utils";
import ProductSlider from "./ProductSlider";

const ProductShowcase = ({ products, category, skeletonCount, showAll }) => {
  if (!products || !products.length) {
    return new Array(skeletonCount).fill({}).map((product, index) => (
      <FeaturedProduct
        // eslint-disable-next-line react/no-array-index-key
        key={`product-skeleton ${index}`}
        product={product}
      />
    ));
  }

  return showAll ? (
    <div className={classNames("product-showcase-grid")}>
      {products.map((product) => (
        <FeaturedProduct key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div>
      <ProductSlider
        products={products}
        itemsToShow={calculateElementsThatFit(280, 30, category)}
      />
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
