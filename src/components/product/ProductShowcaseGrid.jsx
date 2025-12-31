/* eslint-disable react/forbid-prop-types */
import { FeaturedProduct } from "@/components/product";
import useProductAvailability from "@/hooks/useProductAvailability";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Flex, Empty } from "antd";
import PropType from "prop-types";
import React, { useCallback } from "react";
import { calculateElementsThatFit } from "@/helpers/utils";
import ProductSlider from "./ProductSlider";

const ProductShowcase = ({ products, category, showAll }) => {
  const { hideOutOfStock, rentalPeriod } = useSelector((state) => ({
    hideOutOfStock: state.app.hideOutOfStock,
    rentalPeriod: state.app.rentalPeriod,
  }));

  const isItemOutOfStock = useCallback(
    (product) => {
      if (product.skeleton) {
        return false;
      }
      return !product.isProductAvailable(...rentalPeriod.dates);
    },
    [rentalPeriod]
  );

  const filteredProducts = hideOutOfStock
    ? products.filter((product) => !isItemOutOfStock(product))
    : products;

  if (filteredProducts.length === 0) {
    return (
      <Empty description="No products available for selected rental period" />
    );
  }

  return showAll ? (
    <div className={classNames("product-showcase-grid")}>
      {filteredProducts.map((product) => (
        <FeaturedProduct key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div>
      <ProductSlider
        products={filteredProducts}
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
