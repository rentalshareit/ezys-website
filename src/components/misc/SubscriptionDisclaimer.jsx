import { Modal, Checkbox, Typography, Space, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  confirmDisclaimer,
  cancelDisclaimer,
} from "@/redux/actions/miscActions";
import { getSubscriptionConfig } from "@/helpers/utils";

const { Text, Link, Title } = Typography;

const SubscriptionDisclaimer = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const { visible, product } = useSelector(
    (state) => state.app.subscriptionDisclaimerModal || {},
  );

  const config = getSubscriptionConfig(product?.subscription_type) || {};

  const handleConfirm = () => {
    dispatch(confirmDisclaimer());
  };

  const handleCancel = () => {
    dispatch(cancelDisclaimer());
  };

  useEffect(() => {
    if (!visible) {
      setChecked(false);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      title={
        <Space align="center" size={4}>
          <InfoCircleOutlined
            style={{ color: "rgb(13, 148, 136)", fontSize: "15px" }}
          />
          <Title level={5} style={{ margin: 0, color: "rgb(13, 148, 136)" }}>
            {config.title}
          </Title>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div style={{ padding: "10px" }}>
          <Text style={{ fontWeight: "400" }}>
            Our product provides access to the{" "}
            <Link
              href={config.catalogLink}
              target="_self"
              onClick={handleCancel}
            >
              <span style={{ color: "rgb(13, 148, 136)", fontWeight: "600" }}>
                {config.serviceName}
              </span>{" "}
            </Link>
            subscription. Enjoy a {config.description}
          </Text>
          <br />
          <br />
          <Text type="warning" strong>
            ⚠️ Game availability, features & links managed by {config.vendor} –
            subject to change without notice.
          </Text>
          <br />
          <br />
          <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
            style={{
              fontSize: "16px",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              borderColor: "#f0f0f0",
              width: "100%",
              padding: "4px",
            }}
          >
            <Text strong style={{ display: "block", marginBottom: "8px" }}>
              I confirm I've reviewed and understand{" "}
              <Link href={config.catalogLink} target="_blank">
                {config.serviceName} catalog
              </Link>
              <span style={{ fontWeight: "400" }}>
                {" "}
                <i>
                  (content managed by {config.vendor} and may change anytime)
                </i>
              </span>
            </Text>
          </Checkbox>
        </div>

        <Space style={{ width: "100%", justifyContent: "flex-end" }}>
          <Button onClick={handleCancel}>Close</Button>
          <Button disabled={!checked} onClick={handleConfirm}>
            I Understand & Continue
          </Button>
        </Space>
      </Space>
    </Modal>
  );
};

export default SubscriptionDisclaimer;
