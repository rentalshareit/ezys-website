import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearBasket } from "@/redux/actions/basketActions";
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
  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const dispatch = useDispatch();
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
    const { value, countryCode } = shipping.mobile;
    const phone = value.substr(value.indexOf(countryCode) + countryCode.length);
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
          phone,
          period: `${basket[0].period.dates.join(" - ")} (${
            basket[0].period.days
          })`,
          email: shipping.email,
          amount: subtotal,
          payment: values.type,
          products: basket.map((b) => `${b.quantity} x ${b.name}`).join("\n"),
          orderTotal: basket
            .map(
              (b) => b.price[basket[0].period.days - 1] / basket[0].period.days
            )
            .join("\n"),
          coupon: "",
        }),
      }
    );
    dispatch(clearBasket());
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
            <Total subtotal={subtotal} loading={loading} />
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
