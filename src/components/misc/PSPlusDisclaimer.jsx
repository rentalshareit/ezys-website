import { Modal, Checkbox, Typography, Space, Button, Divider } from "antd";
import { InfoCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  confirmDisclaimer,
  cancelDisclaimer,
} from "@/redux/actions/miscActions";

const { Text, Link, Title } = Typography;

const PSPlusDisclaimer = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const { visible } = useSelector(
    (state) => state.app.psPlusDisclaimerModal || {}
  );

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
            PlayStation Plus Deluxe Consent
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
        {/* Custom Info Box */}
        <div
          style={{
            padding: "10px",
          }}
        >
          <Text style={{ fontWeight: "400" }}>
            Our console provides access to the{" "}
            <Link
              href="https://www.playstation.com/en-in/ps-plus/games/"
              target="_blank"
            >
              <span style={{ color: "rgb(13, 148, 136)", fontWeight: "600" }}>
                PS Plus Deluxe
              </span>{" "}
            </Link>
            subscription. Enjoy a rotating selection of popular titles from
            Sony's extensive library.
          </Text>
          <br />
          <br />
          <Text type="warning" strong>
            ⚠️ Game availability, features & links managed by Sony – subject to
            change without notice.
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
              I confirm I've reviewed and understand:
            </Text>
            <Space
              direction="vertical"
              style={{ width: "100%", paddingLeft: "20px" }}
            >
              <Text>
                •{" "}
                <Link
                  href="https://www.playstation.com/en-in/ps-plus/games/"
                  target="_blank"
                >
                  PS Plus Deluxe Games Catalog
                </Link>
                <span style={{ fontWeight: "400" }}>
                  {" "}
                  <i>(content managed by Sony and may change anytime)</i>
                </span>
              </Text>
              <Text style={{ fontWeight: "400" }}>
                • Package Includes HDMI cable, USB cable, Power cable and
                controller/s.
              </Text>
            </Space>
          </Checkbox>
          {/* Acknowledgment Checkbox */}
        </div>

        {/* Action Buttons */}
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

export default PSPlusDisclaimer;
