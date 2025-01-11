/* eslint-disable react/jsx-props-no-spreading */
import { LoadingOutlined } from "@ant-design/icons";
import { Boundary, MessageDisplay } from "@/components/common";
import { ProductShowcaseGrid } from "@/components/product";
import { useDidMount } from "@/hooks";
import { Spin } from "antd";
import PropType from "prop-types";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRequestStatus } from "@/redux/actions/miscActions";
import { searchProduct } from "@/redux/actions/productActions";

const Search = ({ match }) => {
  const { searchKey } = match.params;
  const dispatch = useDispatch();
  const didMount = useDidMount(true);
  const store = useSelector((state) => ({
    isLoading: state.app.loading,
    products: state.products.searchedProducts.items,
    basket: state.basket,
    requestStatus: state.app.requestStatus,
  }));

  useEffect(() => {
    if (didMount && !store.isLoading) {
      dispatch(searchProduct(searchKey));
    }
  }, [searchKey]);

  useEffect(
    () => () => {
      dispatch(setRequestStatus(""));
    },
    []
  );

  if (store.requestStatus && !store.isLoading) {
    return (
      <main className="content">
        <MessageDisplay
          message={store.requestStatus}
          desc="Try using correct filters or keyword."
        />
      </main>
    );
  }

  if (!store.requestStatus && !store.isLoading) {
    return (
      <Boundary>
        <main className="content">
          <section className="product-list-wrapper product-list-search">
            {!store.requestStatus && (
              <div className="product-list-header">
                <div className="product-list-header-title">
                  {`Found ${store.products.length} ${
                    store.products.length > 1 ? "products" : "product"
                  } with keyword ${searchKey}`}
                </div>
              </div>
            )}
            <ProductShowcaseGrid products={store.products} skeletonCount={4} />
          </section>
        </main>
      </Boundary>
    );
  }

  return (
    <main className="content">
      <div className="loader">
        <h4>Searching Product...</h4>
        <div className="ezys-spinner" style={{ alignItems: "unset" }}>
          <Spin size="large" />
        </div>
      </div>
    </main>
  );
};

Search.propTypes = {
  match: PropType.shape({
    params: PropType.shape({
      searchKey: PropType.string,
    }),
  }).isRequired,
};

export default Search;
