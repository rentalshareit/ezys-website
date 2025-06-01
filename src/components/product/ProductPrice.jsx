import { CheckOutlined } from "@ant-design/icons";
import { ImageLoader, Modal } from "@/components/common";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import React from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { usePagination } from "@table-library/react-table-library/pagination";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import { Table } from "antd";
import { calculateProductPrice } from "@/helpers/utils";

const ProductPrice = ({ product, onClose, showPrice }) => {
  const data = (product?.price || []).map((p, index) => {
    const [original, discounted] = calculateProductPrice(
      product,
      index + 1,
      true
    );
    return {
      days: index + 1,
      original,
      discounted,
    };
  });

  const columns = [
    { title: "Days", key: "days", dataIndex: "days" },
    {
      title: "Original Price",
      key: "original",
      dataIndex: "original",
    },
    product.discount
      ? {
          title: "Discounted Price",
          key: "discounted",
          dataIndex: "discounted",
        }
      : null,
  ].filter((_) => _);

  if (!product) return null;

  return (
    <Modal
      isOpen={showPrice}
      overrideStyle={{ padding: "30px 30px", width: "50rem" }}
      onRequestClose={onClose}
    >
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <h6>Price Table</h6>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          size="small"
          pagination={{ defaultPageSize: 5 }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 10,
          }}
        >
          <button
            className="button button-small"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

ProductPrice.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  product: PropType.object.isRequired,
  onClose: PropType.func.isRequired,
};

export default ProductPrice;
