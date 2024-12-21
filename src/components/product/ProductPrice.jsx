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

const ProductPrice = ({ product, isItemOnBasket, addToBasket }) => {
  const theme = useTheme(getTheme());
  function onPaginationChange(action, state) {
    console.log(action, state);
  }

  const data = {
    nodes: [
      {
        id: "0",
        name: "Shopping List",
        deadline: new Date(2020, 1, 15),
        type: "TASK",
        isComplete: true,
        nodes: 3,
      },
      {
        id: "1",
        name: "Shopping List",
        deadline: new Date(2020, 1, 15),
        type: "TASK",
        isComplete: true,
        nodes: 3,
      },
      {
        id: "2",
        name: "Shopping List",
        deadline: new Date(2020, 1, 15),
        type: "TASK",
        isComplete: true,
        nodes: 3,
      },
      {
        id: "3",
        name: "Shopping List",
        deadline: new Date(2020, 1, 15),
        type: "TASK",
        isComplete: true,
        nodes: 3,
      },
    ],
  };

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 2,
    },
    onChange: onPaginationChange,
  });

  const COLUMNS = [
    { label: "Task", renderCell: (item) => item.name },
    {
      label: "Deadline",
      renderCell: (item) =>
        item.deadline.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    { label: "Type", renderCell: (item) => item.type },
    {
      label: "Complete",
      renderCell: (item) => item.isComplete.toString(),
    },
    { label: "Tasks", renderCell: (item) => item.nodes },
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
