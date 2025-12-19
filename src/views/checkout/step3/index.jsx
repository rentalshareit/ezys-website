import {
  CHECKOUT_STEP_1,
  TERMS,
  DAMAGE,
  SHIPPING,
  CANCELLATION,
} from "@/constants/routes";
import { Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React, { useState, useEffect } from "react";
import { Redirect, Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearBasket } from "@/redux/actions/basketActions";
import { CHECKOUT_STEP_2 } from "@/constants/routes";
import { setPaymentDetails } from "@/redux/actions/checkoutActions";
import * as Yup from "yup";
import useProductAvailability from "@/hooks/useProductAvailability";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import PayOnDelivery from "./PayOnDelivery";
import Total from "./Total";
import Confirm from "../confirm";

const FormSchema = Yup.object().shape({
  type: Yup.string().required("Please select paymend mode"),
  tncAccepted: Yup.boolean().isTrue(),
});

const Payment = ({
  payment,
  shipping,
  profile,
  basket,
  subtotal,
  code,
  discount,
  miscCharges,
  rentalPeriod,
}) => {
  const [loading, setLoading] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const { getAvailableProductCode } = useProductAvailability();
  const dispatch = useDispatch();
  const history = useHistory();
  const email = shipping.email || profile.email;
  const orderNo = Date.now().toString(36);
  useDocumentTitle("Check Out Final Step | Ezys");
  useScrollTop();

  const customerAddress = `Flat Number: ${shipping.flatOrHouseNumber} \n
  ${shipping.buildingName ? `Building Name: ${shipping.buildingName}` : ""} \n
  Address: ${shipping.address.address} \n
  Pin Code: ${shipping.address.pinCode} \n
  LatLng: ${shipping.address.position.lat}, ${shipping.address.position.lng}`;

  const initFormikValues = {
    type: payment.type || "payondelivery",
    tncAccepted: !!payment.tncAccepted || false,
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
          address: customerAddress,
          phone,
          period: `${rentalPeriod.dates.join(" - ")} (${rentalPeriod.days})`,
          email: shipping.email,
          deliveryTimeSlot: shipping.deliveryTimeSlot,
          amount: subtotal + miscCharges.shippingCharges || 0,
          shippingCharges: miscCharges.shippingCharges,
          payment: values.type,
          products: basket.map((b) => `${b.quantity} x ${b.name}`).join("\n"),
          tags: basket.map((b) => b.tags.join("\n")).join("\n"),
          orderTotal: basket
            .map((b) => b.price[rentalPeriod.days - 1] / rentalPeriod.days)
            .join("\n"),
          coupon: "",
          tags: basket
            .map((b) =>
              getAvailableProductCode(b, ...rentalPeriod.dates).join("\n")
            )
            .join("\n"),
          code,
          discount,
        }),
      }
    );
    dispatch(clearBasket());
    setLoading(false);
    setOrderConfirmed(true);
  };

  const onClickBack = (values) => {
    dispatch(setPaymentDetails({ ...values })); // save payment details
    history.push(CHECKOUT_STEP_2, {
      fromAction: true,
    });
  };

  if (!shipping || !shipping.isDone) {
    return (
      <Redirect
        to={{ pathname: CHECKOUT_STEP_1, state: { fromAction: true } }}
      />
    );
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validateOnMount
        validationSchema={FormSchema}
        onSubmit={onConfirm}
      >
        {(props) => (
          <Form className="checkout-step-3">
            <PayOnDelivery />
            <div
              style={{ paddingLeft: "1.2rem", display: "flex", gap: "1rem" }}
            >
              <input
                id="tncAcceptedCheckbox"
                type="checkbox"
                onChange={props.handleChange}
                value={props.values.tncAccepted}
                checked={props.values.tncAccepted}
                style={{ display: "unset" }}
                name="tncAccepted"
              />
              <label
                for="tncAcceptedCheckbox"
                style={{
                  color: "#818181",
                  fontSize: "1.1rem",
                  display: "block",
                }}
              >
                I acknowledge that I have read, understand, and agree to the
                <Link to={TERMS}> Terms & Conditions</Link>,
                <Link to={DAMAGE}> Damage Policy</Link>,
                <Link to={CANCELLATION}> Cancellation Policy</Link> and
                <Link to={SHIPPING}> Shipping Policy</Link>.
              </label>
            </div>
            <Total
              valid={props.isValid}
              subtotal={subtotal}
              miscCharges={miscCharges}
              loading={loading}
              onClickBack={onClickBack}
            />
          </Form>
        )}
      </Formik>
      <Confirm isOpen={orderConfirmed} orderId={orderNo} email={email} />
    </div>
  );
};

Payment.propTypes = {
  payment: PropType.shape({
    type: PropType.string,
    tncAccepted: PropType.bool,
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
