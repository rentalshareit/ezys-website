/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { CheckCircleFilled } from "@ant-design/icons";
import { Boundary, Modal } from "@/components/common";
import { ACCOUNT } from "@/constants/routes";
import PropType from "prop-types";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Confirm = ({ orderId, isOpen, email }) => {
  const [timer, setTimer] = useState(30);
  const history = useHistory();

  useEffect(() => {
    let t;
    if (isOpen) {
      t = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => clearInterval(t);
  }, [isOpen]);

  useEffect(() => {
    if (timer === 0) {
      history.push(ACCOUNT);
    }
  }, [timer]);

  return (
    <Boundary>
      <Modal
        isOpen={isOpen}
        overrideStyle={{
          padding: "10px 50px",
          width: "80%",
        }}
      >
        <CheckCircleFilled
          style={{
            fontSize: "4rem",
            color: "rgb(13, 148, 136)",
            marginBottom: "1rem",
          }}
        />
        <p className="text-center">Thank you for your order!</p>
        <div
          className="text-center"
          style={{
            paddingTop: "1.4rem",
            fontSize: "1.1rem",
          }}
        >
          Your order has been placed. You will receive details over email
          shortly. <br />
          <br />
          <div
            style={{
              color: "rgb(13, 148, 136)",
            }}
          >
            To confirm your order, please complete your KYC on the order page
            within <b>8 hours</b>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "10px",
              justifyContent: "center",
              color: "rgb(9,103,95)",
            }}
          >
            Redirecting to order page in {timer} seconds ...
          </div>
        </div>
      </Modal>
    </Boundary>
  );
};

Confirm.propTypes = {
  orderId: PropType.string.isRequired,
  email: PropType.string.isRequired,
  isOpen: PropType.bool.isRequired,
};

export default Confirm;
