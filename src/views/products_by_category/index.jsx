import { useParams } from "react-router-dom";
import { Tour } from "antd";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import gaming_consoles from "@/images/gaming_consoles.jpeg";
import virtual_reality from "@/images/virtual_reality.jpeg";
import games_controllers from "@/images/games_controllers.jpeg";
import { useDocumentTitle, useProducts, useScrollTop, useTour } from "@/hooks";
import React from "react";

const images = {
  gaming_consoles,
  virtual_reality,
  games_controllers,
};

const steps = [
  {
    title: "Add To Basket",
    description: "Add item to your basket",
    target: () =>
      document.querySelector("[id^='btn-add-basket-Gaming Consoles-']"),
  },
  {
    title: "Product Price",
    description:
      "Click here to view the price of the product for 1-30 days rental.",
    target: () =>
      document.querySelector("[id^='btn-view-price-Gaming Consoles-']"),
  },
  {
    title: "Product Details",
    description: "Click this to view product details.",
    target: () =>
      document.querySelector(
        "[id^='card-view-product-details-Gaming Consoles-']"
      ),
  },
];

const ProductsByCategory = () => {
  const params = useParams();
  const { category } = params;
  useDocumentTitle("Products By Category | Ezys");
  useScrollTop();

  const { products, getProducts, isLoading, error } = useProducts(category);

  const tourProps = useTour(
    "productCategory",
    steps,
    () => !!Object.keys(products).length && category === "Gaming Consoles",
    [products, category],
    500
  );

  const banner = category
    .toLocaleLowerCase()
    .replaceAll("& ", "")
    .replaceAll(" ", "_");

  return (
    <main className="content">
      <Tour {...tourProps} />
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h2>{category}</h2>
          </div>
          <div className="banner-img">
            <img src={images[banner]} alt="" />
          </div>
        </div>
        <div className="display">
          {error && !isLoading ? (
            <MessageDisplay
              message={error}
              action={fetchFeaturedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={products[category] || []}
              skeletonCount={6}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductsByCategory;
