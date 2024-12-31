import { useParams } from "react-router-dom";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { useDocumentTitle, useProducts, useScrollTop } from "@/hooks";
import bannerImg from "@/images/banner-guy.png";
import React from "react";

const ProductsByCategory = () => {
  const params = useParams();
  const { category } = params;
  console.log("category", category);
  useDocumentTitle("Products By Category | Ezys");
  useScrollTop();

  const { products, getProducts, isLoading, error } = useProducts(category);

  return (
    <main className="content">
      <div className="featured">
        <div className="banner">
          <div className="banner-desc">
            <h1>{category}</h1>
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
