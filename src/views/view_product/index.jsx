import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { ImageLoader, MessageDisplay, Modal } from "@/components/common";
import { ProductShowcaseGrid, ProductPrice } from "@/components/product";
import { RECOMMENDED_PRODUCTS } from "@/constants/routes";
import { displayMoney } from "@/helpers/utils";
import {
  useBasket,
  useDocumentTitle,
  useProduct,
  useRecommendedProducts,
  useScrollTop,
} from "@/hooks";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import Select from "react-select";

const styles = {
  view: {
    width: "100%",
  },
  productInformation: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "3rem",
    },
    key: {
      color: "rgb(82 82 82)",
      fontSize: "1.3rem",
      lineHeight: "1.6rem",
      fontWeight: 500,
    },
    value: {
      color: "rgb(115 115 115)",
      fontSize: "1.3rem",
      lineHeight: "1.6rem",
      fontWeight: 500,
    },
  },
};

const ViewProduct = () => {
  const [showPrice, setShowPrice] = useState(false);
  const { id } = useParams();
  const history = useHistory();
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || "Item"}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || "");

  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured,
  } = useRecommendedProducts(6);
  const colorOverlay = useRef(null);

  useEffect(() => {
    setSelectedImage(product?.image);
  }, [product]);

  const onSelectedSizeChange = (newValue) => {
    setSelectedSize(newValue.value);
  };

  const handlePriceView = () => {
    setShowPrice(true);
  };

  const handleAddToBasket = () => {
    addToBasket(product);
  };

  return (
    <main className="content">
      {isLoading && (
        <div className="loader">
          <h3>Loading Product...</h3>
          <div
            className="ezys-spinner"
            style={{ marginTop: "2rem", height: "unset" }}
          >
            <Spin size="large" />
          </div>
        </div>
      )}
      {error && <MessageDisplay message={error} />}
      {product && !isLoading && (
        <div style={styles.view} className="product-view">
          <div className="product-modal">
            <div className="product-modal-image-wrapper">
              <ImageLoader
                alt={product.name}
                className="product-modal-image"
                src={selectedImage}
              />
              {product.imageCollection.length !== 0 && (
                <div className="product-modal-image-collection">
                  {product.imageCollection.map((image) => (
                    <div
                      className="product-modal-image-collection-wrapper"
                      key={image.id}
                      onClick={() => setSelectedImage(image.url)}
                      role="presentation"
                    >
                      <ImageLoader
                        className="product-modal-image-collection-img"
                        src={image.url}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="product-modal-details">
              <span className="text-subtle">{product.brand}</span>
              <h3 className="margin-top-0">{product.name}</h3>
              <span className="text-subtle">{product.description}</span>
              <br />
              <br />
              <div className="divider" />
              <div
                style={{ marginTop: "8px", paddingTop: "8px" }}
                id="product-specs"
              >
                <h5 class="text-sm font-medium text-gray-900">
                  Product Information
                </h5>
                <div style={{ marginTop: "6px" }}>
                  <dl style={styles.productInformation.root}>
                    {product.setup && (
                      <div
                        class="grid-count-2 bg-white px-4 py-5 first:rounded-t-lg last:rounded-b-lg sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                        id="product-spec-1"
                      >
                        <dt style={styles.productInformation.key}>Setup</dt>
                        <dd style={styles.productInformation.value}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: product.setup,
                            }}
                          />
                        </dd>
                      </div>
                    )}
                    {product.included && (
                      <div
                        class="grid-count-2 bg-gray-50 px-4 py-5 first:rounded-t-lg last:rounded-b-lg sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                        id="product-spec-2"
                      >
                        <dt style={styles.productInformation.key}>
                          What's included
                        </dt>
                        <dd style={styles.productInformation.value}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: product.included,
                            }}
                          />
                        </dd>
                      </div>
                    )}
                    {product.configuration && (
                      <div
                        class="grid-count-2 bg-white px-4 py-5 first:rounded-t-lg last:rounded-b-lg sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                        id="product-spec-3"
                      >
                        <dt style={styles.productInformation.key}>
                          Configuration
                        </dt>

                        <dd style={styles.productInformation.value}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: product.configuration,
                            }}
                          />
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              <br />

              <div className="product-modal-action">
                <button
                  className={`button button-small ${
                    isItemOnBasket(product.id)
                      ? "button-border button-border-gray"
                      : ""
                  }`}
                  onClick={handleAddToBasket}
                  type="button"
                >
                  {isItemOnBasket(product.id)
                    ? "Remove From Basket"
                    : "Add To Basket"}
                </button>
                <button
                  className="button button-small"
                  onClick={handlePriceView}
                  type="button"
                >
                  View Price
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "5rem" }}>
            <div className="display-header">
              <h3>Recommended</h3>
              <button
                className="button button-border button-border-primary button-small"
                type="button"
                onClick={() => history.push(RECOMMENDED_PRODUCTS)}
              >
                See All
              </button>
            </div>
            {errorFeatured && !isLoadingFeatured ? (
              <MessageDisplay
                message={error}
                action={fetchRecommendedProducts}
                buttonLabel="Try Again"
              />
            ) : (
              <ProductShowcaseGrid
                products={recommendedProducts}
                skeletonCount={3}
              />
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={showPrice}
        overrideStyle={{ padding: "30px 30px", width: "50rem" }}
        onRequestClose={() => setShowPrice(false)}
      >
        <ProductPrice product={product} onClose={() => setShowPrice(false)} />
      </Modal>
    </main>
  );
};

export default ViewProduct;
