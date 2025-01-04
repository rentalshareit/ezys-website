import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import React, { lazy, Suspense } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { addProduct } from "@/redux/actions/productActions";

const ProductForm = lazy(() => import("../components/ProductForm"));

const AddProduct = () => {
  useScrollTop();
  useDocumentTitle("Add New Product | Ezys");
  const isLoading = useSelector((state) => state.app.loading);
  const dispatch = useDispatch();

  const onSubmit = (product) => {
    dispatch(addProduct(product));
  };

  return (
    <div className="product-form-container">
      <h2>Add New Product</h2>
      <Suspense
        fallback={
          <div className="loader" style={{ minHeight: "80vh" }}>
            <h6>Loading ... </h6>
            <div className="ezys-spinner">
              <Spin size="large" />
            </div>
          </div>
        }
      >
        <ProductForm
          isLoading={isLoading}
          onSubmit={onSubmit}
          product={{
            name: "",
            brand: "",
            price: "",
            maxQuantity: 0,
            category: "",
            description: "",
            keywords: [],
            image: "",
            isFeatured: false,
            isRecommended: false,
            setup: "",
            included: "",
            configuration: "",
            features: "",
            imageCollection: [],
          }}
        />
      </Suspense>
    </div>
  );
};

export default withRouter(AddProduct);
