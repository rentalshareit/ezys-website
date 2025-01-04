import { useParams } from "react-router-dom";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import gaming_consoles from "@/images/gaming_consoles.jpeg";
import virtual_reality from "@/images/virtual_reality.jpeg";
import games_controllers from "@/images/games_controllers.jpeg";
import { useDocumentTitle, useProducts, useScrollTop } from "@/hooks";
import React from "react";

const images = {
  gaming_consoles,
  virtual_reality,
  games_controllers,
};

const ProductsByCategory = () => {
  const params = useParams();
  const { category } = params;
  useDocumentTitle("Products By Category | Ezys");
  useScrollTop();

  const { products, getProducts, isLoading, error } = useProducts(category);
  const banner = category
    .toLocaleLowerCase()
    .replaceAll("& ", "")
    .replaceAll(" ", "_");

  return (
    <main className="content">
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
