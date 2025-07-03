import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { useDocumentTitle, useFeaturedProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/featured_products.jpeg";
import React from "react";

const FeaturedProducts = () => {
  useDocumentTitle("Featured Products | Ezys");
  useScrollTop();

  const { featuredProducts, fetchFeaturedProducts, isLoading, error } =
    useFeaturedProducts();

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h2>Featured Products</h2>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
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
              products={featuredProducts}
              
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default FeaturedProducts;
