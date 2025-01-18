/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { CheckCircleFilled } from "@ant-design/icons";
import { Boundary, Modal } from "@/components/common";
import { ACCOUNT } from "@/constants/routes";
import PropType from "prop-types";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

const Confirm = ({ orderId, isOpen, email }) => {
  const [timer, setTimer] = useState(5);
  const history = useHistory();

  useEffect(() => {
    const t = setInterval(() => {
      setTimer((timer) => timer - 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

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
          padding: "10px 10px",
          width: "50rem",
          height: "20rem",
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
          style={{
            paddingTop: "1.4rem",
            fontSize: "1.1rem",
          }}
        >
          Your order now has been placed. You will shortly receive confirmation
          to email shortly. You can check the status of your order at any time
          by going to "My Account".
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "1rem",
            justifyContent: "center",
            color: "rgb(13, 148, 136)",
          }}
        >
          Redirecting to order page in {timer} seconds ...
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
