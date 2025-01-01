import { CheckOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { usePagination } from "@table-library/react-table-library/pagination";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";

const ProductPrice = ({ product }) => {
  const theme = useTheme(getTheme());
  function onPaginationChange(action, state) {
    console.log(action, state);
  }

  const data = {
    nodes: product.price.map((p, index) => ({
      days: index + 1,
      price: p,
    })),
  };

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 5,
    },
    onChange: onPaginationChange,
  });

  const COLUMNS = [
    { label: "Days", renderCell: (item) => item.days },
    {
      label: "Price Per Day",
      renderCell: (item) => displayMoney(item.price),
    },
    { label: "Total Price", renderCell: (item) => item.price * item.days },
  ];

  return (
    <div>
      <CompactTable
        columns={COLUMNS}
        data={data}
        theme={theme}
        pagination={pagination}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <span>
          Page:{" "}
          {pagination.state.getPages(data.nodes).map((_, index) => (
            <button
              key={index}
              type="button"
              style={{
                fontWeight: pagination.state.page === index ? "bold" : "normal",
                marginLeft: 10,
              }}
              onClick={() => pagination.fns.onSetPage(index)}
            >
              {index + 1}
            </button>
          ))}
        </span>
      </div>
    </div>
  );
};

ProductPrice.defaultProps = {
  isItemOnBasket: undefined,
  addToBasket: undefined,
};

ProductPrice.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  product: PropType.object.isRequired,
  isItemOnBasket: PropType.func,
  addToBasket: PropType.func,
};

export default ProductPrice;
