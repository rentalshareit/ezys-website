import React from "react";
import { Modal, Button } from "antd";

const PackageInfoModal = ({ visible, onClose, product }) => (
  <Modal
    title="Package Contents"
    open={visible}
    onCancel={onClose}
    wrapClassName="package-info-modal"
    width={500}
    footer={
      <Button type="primary" onClick={onClose}>
        OK
      </Button>
    }
    closable={false} // 3. No cross/close icon at top
    maskClosable={false} // Optional: prevent closing by clicking outside
  >
    <ol style={{ paddingLeft: 20, margin: 0 }}>
      {product.included.split(",").map((item, index) => (
        <li key={index}>{item.trim()}</li>
      ))}
    </ol>
  </Modal>
);

export default PackageInfoModal;
