import { ArrowRightOutlined } from "@ant-design/icons";
import { Spin, Tour } from "antd";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import GoogleReviews from "@/components/misc/GoogleReviews";
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
  useTour,
} from "@/hooks";
import coverImg from "@/images/gaming_banner.jpeg";
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

// TODO: Uncomment this as it flickers on mobile devices
const steps = [
  {
    title: "See All",
    description: "Click to see all products in this category.",
    target: () => document.querySelector("[id^=btn-see-all-]"),
  },
  {
    title: "View Price",
    description: "Click to view the price of the product.",
    target: () => document.querySelector("[id^=btn-view-price-]"),
  },
  {
    title: "Product Details",
    description: "Click to view product details.",
    target: () => document.querySelector("[id^=card-view-product-details]"),
  },
  // {
  //   title: "Go To Basket",
  //   description: "Click here to check your basket and proceed to checkout.",
  //   target: () => document.querySelector("[id^=btn-basket-toggle]"),
  // },
];

const Home = () => {
  const tourProps = useTour(steps);
  const history = useHistory();
  useDocumentTitle("Ezys | Home");
  useScrollTop();

  const { products, fetchProducts, isLoading, error } = useProducts();

  return (
    <main className="content" style={{ flexDirection: "column" }}>
      <Tour {...tourProps} />
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">
              <strong>Rent</strong>
              &nbsp;with ease at&nbsp;
              <strong style={{ color: "rgb(13, 148, 136)" }}>Ezys</strong>
            </h1>
            <p style={{ color: "#818181" }}>
              Why buy when you can rent? With Ezys, access a wide selection of
              quality products without the commitment of ownership.
            </p>
            <br />
          </div>
          <div className="banner-img">
            <img src={coverImg} alt="" />
          </div>
        </div>
        {isLoading && (
          <div
            className="ezys-spinner"
            style={{ height: "unset", marginTop: "5rem" }}
          >
            <Spin size="large" />
          </div>
        )}
        {Object.keys(products).map((category) => (
          <div className="display">
            <div className="display-header">
              <h3>{category}</h3>
              <button
                id={`btn-see-all-${category}`}
                className="button button-border button-border-primary button-small"
                type="button"
                onClick={() => history.push(`/products/${category}`)}
              >
                See All
              </button>
            </div>
            <ProductShowcaseGrid
              products={products[category]}
              skeletonCount={4}
              showAll={false}
            />
          </div>
        ))}
      </div>
      <GoogleReviews />
    </main>
  );
};

export default Home;
