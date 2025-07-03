/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import classNames from "classnames";
import { Flex } from "antd";
import PropType from "prop-types";
import React from "react";
import { calculateElementsThatFit } from "@/helpers/utils";
import ProductSlider from "./ProductSlider";

const ProductShowcase = ({ products, category, showAll }) => {
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
  showAll: true,
  category: "",
};

ProductShowcase.propTypes = {
  products: PropType.array.isRequired,
  category: PropType.string,
  showAll: PropType.bool,
};

export default ProductShowcase;
