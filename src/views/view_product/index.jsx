import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  ColorChooser,
  ImageLoader,
  MessageDisplay,
  Modal,
} from "@/components/common";
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
import { Link, useParams } from "react-router-dom";
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
  const { product, isLoading, error } = useProduct(id);
  const { addToBasket, isItemOnBasket } = useBasket(id);
  useScrollTop();
  useDocumentTitle(`View ${product?.name || "Item"}`);

  const [selectedImage, setSelectedImage] = useState(product?.image || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

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

  const onSelectedColorChange = (color) => {
    setSelectedColor(color);
    if (colorOverlay.current) {
      colorOverlay.current.value = color;
    }
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
          <h4>Loading Product...</h4>
          <br />
          <LoadingOutlined style={{ fontSize: "3rem" }} />
        </div>
      )}
      {error && <MessageDisplay message={error} />}
      {product && !isLoading && (
        <div style={styles.view} className="product-view">
          <div className="product-modal">
            <div className="product-modal-image-wrapper">
              {selectedColor && (
                <input
                  type="color"
                  disabled
                  ref={colorOverlay}
                  id="color-overlay"
                />
              )}
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
                    <div
                      class="grid-count-2 bg-white px-4 py-5 first:rounded-t-lg last:rounded-b-lg sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                      id="product-spec-1"
                    >
                      <dt style={styles.productInformation.key}>Setup</dt>
                      <dd style={styles.productInformation.value}>
                        Easy Installation, Can be self installed
                      </dd>
                    </div>
                    <div
                      class="grid-count-2 bg-gray-50 px-4 py-5 first:rounded-t-lg last:rounded-b-lg sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                      id="product-spec-2"
                    >
                      <dt style={styles.productInformation.key}>
                        What's included
                      </dt>
                      <dd style={styles.productInformation.value}>
                        PS4 console, 2 controllers, HDMI cable, Power cable,
                        Extra Subscription
                      </dd>
                    </div>
                    <div
                      class="grid-count-2 bg-white px-4 py-5 first:rounded-t-lg last:rounded-b-lg sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                      id="product-spec-3"
                    >
                      <dt style={styles.productInformation.key}>
                        Configuration
                      </dt>
                      <dd style={styles.productInformation.value}>
                        Processor: Custom AMD "Jaguar" x86-64, 8-core CPU
                        Graphics: 4.20 TFLOPS, AMD Radeon™ based graphics engine
                        Memory: 8GB GDDR5 RAM Storage: 1TB hard drive Optical
                        Drive: Blu-ray/DVD Connectivity: Ethernet, Wi-Fi,
                        Bluetooth 4.0 Ports: 3 x USB 3.1 Gen 1 ports, 1 x AUX
                        port Dimensions: Approx. 295mm x 55mm x 327mm (width x
                        height x depth) Weight: Approx. 3.3kg
                      </dd>
                    </div>
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
          <div style={{ marginTop: "10rem" }}>
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
      <Modal isOpen={showPrice} onRequestClose={() => setShowPrice(false)}>
        <ProductPrice />
      </Modal>
    </main>
  );
};

export default ViewProduct;
