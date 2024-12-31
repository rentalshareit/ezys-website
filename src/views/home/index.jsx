import { ArrowRightOutlined } from "@ant-design/icons";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import {
  FEATURED_PRODUCTS,
  RECOMMENDED_PRODUCTS,
  PRODUCTS_BY_CATEGORY,
} from "@/constants/routes";
import {
  useDocumentTitle,
  useFeaturedProducts,
  useRecommendedProducts,
  useScrollTop,
  useProducts,
} from "@/hooks";
import coverImg from "@/images/cover-image.jpg";
import React from "react";
import { Link, useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  useDocumentTitle("Ezys | Home");
  useScrollTop();

  const {
    products,
    fetchProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useProducts();

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">
              <strong>See</strong>
              &nbsp;everything with&nbsp;
              <strong>Clarity</strong>
            </h1>
            <p>
              Buying eyewear should leave you happy and good-looking, with money
              in your pocket. Glasses, sunglasses, and contacts—we’ve got your
              eyes covered.
            </p>
            <br />
          </div>
          <div className="banner-img">
            <img src={coverImg} alt="" />
          </div>
        </div>
        {Object.keys(products).map((category) => (
          <div className="display">
            <div className="display-header">
              <h3>{category}</h3>
              <button
                className="button button-border button-border-primary button-small"
                type="button"
                onClick={() => history.push(`/products/${category}`)}
              >
                See All
              </button>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={errorFeatured}
                action={fetchFeaturedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid
                products={products[category].slice(0, 4)}
                skeletonCount={4}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
