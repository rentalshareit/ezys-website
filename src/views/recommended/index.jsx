import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import {
  useDocumentTitle,
  useRecommendedProducts,
  useScrollTop,
} from "@/hooks";
import bannerImg from "@/images/recommended_products.jpeg";
import React from "react";

const RecommendedProducts = () => {
  useDocumentTitle("Recommended Products | Ezys");
  useScrollTop();

  const { recommendedProducts, fetchRecommendedProducts, isLoading, error } =
    useRecommendedProducts();

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>Recommended Products</h1>
          </div>
          <div className="banner-img">
            <img src={bannerImg} alt="" />
          </div>
        </div>
        <div className="display">
          {error && !isLoading ? (
            <MessageDisplay
              message={error}
              action={fetchRecommendedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={recommendedProducts}
              skeletonCount={6}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default RecommendedProducts;
