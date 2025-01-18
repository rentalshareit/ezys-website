import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import PayOnDelivery from "./PayOnDelivery";
import Total from "./Total";
import Confirm from "../confirm";

const FormSchema = Yup.object().shape({
  type: Yup.string().required("Please select paymend mode"),
});

const Payment = ({ payment, shipping, profile, basket, subtotal }) => {
  const [loading, isLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const email = shipping.email || profile.email;
  const orderNo =
    Date.now().toString(36) + Math.random().toString(36).substring(2);
  useDocumentTitle("Check Out Final Step | Ezys");
  useScrollTop();

  const initFormikValues = {
    type: payment.type || "payondelivery",
  };

  const onConfirm = async (values) => {
    setLoading(true);
    await fetch(
      "https://script.google.com/macros/s/AKfycbxlC2R1EPoKBW65eSoy31fZUbZgMI1prYuG77P5C2guSvUj26bRtKT--JccFVQz5vw/exec",
      {
        method: "post",
        redirect: "follow",
        crossDomain: true,
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "createOrder",
          orderNo,
          date: new Date().toLocaleDateString(undefined, {
            timeZone: "Asia/Kolkata",
          }),
          name: shipping.fullname,
          address: shipping.address,
          phone: shipping.mobile.value.substring(2),
          period: basket[0].period.dates.join("-"),
          email: shipping.email,
          amount: subtotal,
          payment: values.type,
          products: basket.map((b) => b.name).join(","),
          coupon: "",
        }),
      }
    );
    setLoading(false);
    setOrderConfirmed(true);
  };

  useEffect(() => {}, [orderConfirmed]);

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
      <Confirm isOpen={orderConfirmed} orderId={orderNo} email={email} />
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
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
    isDone: PropType.bool,
  }).isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
  }).isRequired,
  basket: PropType.arrayOf(PropType.object).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(Payment);
