import { ArrowRightOutlined } from "@ant-design/icons";
import { Spin, Tour } from "antd";
import { MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import Skeleton from "react-loading-skeleton";
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
import { formatCategory } from "@/helpers/utils";
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import HomeCarousel from "@/components/misc/HomeCarousel";

// TODO: Uncomment this as it flickers on mobile devices
const steps = [
  {
    title: "Console Category",
    description: "Click this to see all types of consoles like PS4, PS5.",
    target: () => document.querySelector("[id='btn-see-all-Gaming Consoles']"),
  },
  {
    title: "Add To Cart",
    description: "Add item to your cart",
    target: () =>
      document.querySelector("[id^='btn-add-basket-Gaming Consoles-']"),
  },
  {
    title: "Product Price",
    description: "View the price of the product for 1-30 days rental.",
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

const Home = () => {
  const history = useHistory();
  useDocumentTitle("Ezys | Home");
  useScrollTop();

  const { products, isLoading, error } = useProducts();
  const tourProps = useTour(
    "home",
    steps,
    () => !!Object.keys(products || {}).length,
    [products],
    200
  );

  const isSkeleton = products[Object.keys(products)[0]].some((p) => p.skeleton);

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
          <div className="banner-img-container">
            <HomeCarousel />
          </div>
        </div>

        {Object.keys(products).map((category, index) => (
          <div
            id={`${formatCategory(category)}_display`}
            className="display"
            style={{ order: index === 0 ? 1 : index === 1 ? 0 : index }}
            key={category}
          >
            <div className="display-header">
              <h3>
                {isSkeleton ? (
                  <Skeleton style={{ width: "200px" }} />
                ) : (
                  category
                )}
              </h3>
              <button
                id={`btn-see-all-${category}`}
                className="button button-border button-small"
                type="button"
                onClick={() => {
                  if (!isSkeleton) history.push(`/products/${category}`);
                }}
              >
                {isSkeleton ? (
                  <Skeleton style={{ width: "50px" }} />
                ) : (
                  "See All"
                )}
              </button>
            </div>
            <ProductShowcaseGrid
              category={category}
              products={products[category]}
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
