import { Modal, Checkbox, Typography, Space, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  confirmDisclaimer,
  cancelDisclaimer,
} from "@/redux/actions/miscActions";

const { Text, Link, Title } = Typography;

const getSubscriptionConfig = (type) => {
  switch (type) {
    case "psn_deluxe":
      return {
        title: "PlayStation Plus Deluxe Consent",
        serviceName: "PS Plus Deluxe",
        vendor: "Sony",
        catalogLink: "https://www.playstation.com/en-in/ps-plus/games/",
        description:
          "rotating selection of popular titles from Sony's extensive library.",
      };
    case "meta_plus":
      return {
        title: "Meta Quest+ Consent",
        serviceName: "Meta Quest+",
        vendor: "Meta",
        catalogLink:
          "https://www.meta.com/experiences/section/746836817401205/",
        description: "monthly rotating VR games catalog from Meta.",
      };
    case "ea_play":
      return {
        title: "EA Play Consent",
        serviceName: "EA Play",
        vendor: "EA",
        catalogLink: "https://www.ea.com/ea-play/games#playstation",
        description:
          "EA franchises including new game trials and member rewards.",
      };
    default:
      return null;
  }
};

const SubscriptionDisclaimer = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const { visible, product } = useSelector(
    (state) => state.app.subscriptionDisclaimerModal || {}
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
            <Link href={config.catalogLink} target="_blank">
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
