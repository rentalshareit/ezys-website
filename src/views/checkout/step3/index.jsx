import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import PayOnDelivery from "./PayOnDelivery";
import Total from "./Total";

const FormSchema = Yup.object().shape({
  type: Yup.string().required("Please select paymend mode"),
});

const Payment = ({ payment, subtotal }) => {
  useDocumentTitle("Check Out Final Step | Ezys");
  useScrollTop();

  const initFormikValues = {
    type: payment.type || "payondelivery",
  };

  const onConfirm = () => {
    displayActionMessage("Feature not ready yet :)", "info");
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onConfirm}
      >
        {() => (
          <Form className="checkout-step-3">
            <PayOnDelivery />
            <Total subtotal={subtotal} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string,
  }).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(Payment);
