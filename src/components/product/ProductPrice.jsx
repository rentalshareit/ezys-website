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

const ProductPrice = ({ product, onClose }) => {
  const stripedTheme = {
    BaseRow: `
        font-size: 12px;
      `,
    HeaderRow: `
        background-color: rgb(13, 148, 136);
        color: #fff;
      `,
  };

  const theme = useTheme([getTheme(), stripedTheme]);
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
      renderCell: (item) => displayMoney(item.price / item.days),
    },
    {
      label: "Total Price",
      renderCell: (item) => displayMoney(item.price),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "5px",
        }}
      >
        <h6>Price chart for 30 days</h6>
      </div>
      <CompactTable
        columns={COLUMNS}
        data={data}
        theme={theme}
        pagination={pagination}
      />
      <div
        style={{
          display: "flex",
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 10,
        }}
      >
        <button className="button button-small" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </div>
  );
};

ProductPrice.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  product: PropType.object.isRequired,
  onClose: PropType.func.isRequired,
};

export default ProductPrice;
