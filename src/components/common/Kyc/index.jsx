import React, { useState } from "react";
import { Steps, ConfigProvider } from "antd";
import PropType from "prop-types";
import logo from "@/images/ezys-logo.png";
import Modal from "../Modal";
import Address from "./address";
import Identification from "./identification";
import Selfie from "./selfie";

const Kyc = ({ orderId, onClose }) => {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onSubmit = async () => {
    setSubmitted(true);
    await fetch(
      "https://script.google.com/macros/s/AKfycbxlC2R1EPoKBW65eSoy31fZUbZgMI1prYuG77P5C2guSvUj26bRtKT--JccFVQz5vw/exec",
      {
        method: "post",
        redirect: "follow",
        crossDomain: true,
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "updateKycStatus",
          orderNo: orderId,
          kycStatus: "KYC_SUBMITTED",
        }),
      }
    );
  };

  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <h5 style={{ color: "rgb(13,148,136)" }}>
          Thank you for submitting KYC details.
        </h5>
        <p
          style={{
            fontSize: "12px",
          }}
        >
          Our agents will verify your documents and process your order. You will
          be notified shortly.
        </p>
        <button
          className="button button-primary button-small"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#0d9488",
          fontSize: 10,
          colorText: "#0d9488",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <img alt="Logo" src={logo} width="50" />
        <h6 style={{ color: "#0d9488", fontWeight: 600, fontSize: "1.6rem" }}>
          Complete your KYC in 3 easy steps
        </h6>
      </div>
      <div
        className="content"
        style={{
          flexDirection: "column",
          minHeight: "unset",
          padding: "unset",
        }}
      >
        <Steps
          size="small"
          current={current}
          direction="horizontal"
          labelPlacement="vertical"
          items={[
            {
              title: "Capture Your Photo",
            },
            {
              title: "Upload Your ID",
            },
            {
              title: "Upload Your Address Proof",
            },
          ]}
        />

        {current === 0 && (
          <Selfie
            current={current}
            onNext={next}
            onPrev={prev}
            orderId={orderId}
          />
        )}
        {current === 1 && (
          <Identification onNext={next} onPrev={prev} orderId={orderId} />
        )}
        {current === 2 && <Address onSubmit={onSubmit} orderId={orderId} />}
      </div>
    </ConfigProvider>
  );
};

const WithModalKyc = ({ show, onClose, orderId }) => {
  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      overrideStyle={{
        padding: "20px 20px",
        width: "80vw",
        maxHeight: "80vh",
      }}
    >
      <Kyc orderId={orderId} onClose={onClose} />
    </Modal>
  );
};

WithModalKyc.propTypes = {
  show: PropType.bool.isRequired,
  onClose: PropType.func.isRequired,
};

export default WithModalKyc;
