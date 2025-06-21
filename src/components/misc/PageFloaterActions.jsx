import React, { useEffect } from "react";
import { FloatButton } from "antd";
import { useDispatch } from "react-redux";
import { updateTourStatus } from "@/redux/actions/miscActions";
import {
  WhatsAppOutlined,
  CustomerServiceOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons"; // Import relevant icons
import { useIsFirstVisit } from "@/hooks";

const PageFloaterActions = () => {
  const dispatch = useDispatch();
  const [isFirstVisit, setIsFirstVisit] = useIsFirstVisit();
  const phoneNumber = "919032477570";

  const preFilledMessage = encodeURIComponent(
    "Hello, I'd like to inquire about your services."
  );

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${preFilledMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const beginTour = () => {
    dispatch(updateTourStatus({ status: false }));
    setIsFirstVisit({});
  };

  return (
    <FloatButton.Group shape="circle">
      <FloatButton
        tooltip="Chat on WhatsApp"
        icon={<WhatsAppOutlined />}
        onClick={handleWhatsAppClick}
        type="primary"
      />
      <FloatButton
        tooltip="Help Me"
        icon={<QuestionCircleOutlined />}
        onClick={beginTour}
        type="primary"
      />
      <FloatButton.BackTop
        tooltip="Scroll to Top"
        visibilityHeight={0}
        type="primary"
      />
    </FloatButton.Group>
  );
};

export default PageFloaterActions;
