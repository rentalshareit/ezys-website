/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Boundary } from "@/components/common";
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from "@/constants/routes";
import { Form, Formik } from "formik";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  setShippingDetails,
  updateMiscCharges,
} from "@/redux/actions/checkoutActions";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import ShippingForm from "./ShippingForm";
import ShippingTotal from "./ShippingTotal";

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Full name is required.")
    .min(2, "Full name must be at least 2 characters long.")
    .max(60, "Full name must only be less than 60 characters."),
  email: Yup.string()
    .email("Email is not valid.")
    .required("Email is required."),
  address: Yup.string().required("Shipping address is required."),
  pinCode: Yup.string()
    .required("Pin code is required.")
    .matches(/^[1-9][0-9]{5}$/, "Pin code must be valid and exactly 6 digits."),
  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required("Mobile number is required"),
      value: Yup.string().required("Mobile number is required"),
    })
    .required("Mobile number is required."),
  isDone: Yup.boolean(),
});

const ShippingDetails = ({ profile, shipping, subtotal, miscCharges }) => {
  useDocumentTitle("Check Out Step 2 | Ezys");
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();

  const initFormikValues = {
    fullname: shipping.fullname || profile.fullname || "",
    email: shipping.email || profile.email || "",
    address: shipping.address || profile.address || "",
    mobile: profile.mobile,
    isDone: shipping.isDone || false,
    deliveryTimeSlot: shipping.deliveryTimeSlot || "10-13",
    pinCode: shipping.pinCode || "",
    shippingCharges: miscCharges.shippingCharges || null,
  };

  const onSubmitForm = (form) => {
    dispatch(
      setShippingDetails({
        fullname: form.fullname,
        email: form.email,
        address: form.address,
        mobile: form.mobile,
        deliveryTimeSlot: form.deliveryTimeSlot,
        pinCode: form.pinCode,
        isDone: true,
      })
    );
    dispatch(
      updateMiscCharges({
        shippingCharges: form.shippingCharges,
      })
    );
    history.push(CHECKOUT_STEP_3, {
      fromAction: true,
    });
  };

  return (
    <Boundary>
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h4 className="text-center">Shipping Details</h4>
          <Formik
            initialValues={initFormikValues}
            validateOnChange
            validationSchema={FormSchema}
            onSubmit={onSubmitForm}
          >
            {({ values, isValid }) => (
              <Form>
                <ShippingForm />
                <br />
                {/*  ---- TOTAL --------- */}
                <ShippingTotal subtotal={subtotal} />
                <div className="checkout-note-wrapper">
                  <b>Note:</b>{" "}
                  <span className="checkout-note">
                    Avoid refreshing the page during checkout to prevent losing
                    your progress.
                  </span>
                </div>
                {/*  ----- NEXT/PREV BUTTONS --------- */}
                <div className="checkout-shipping-action">
                  <button
                    className="button button-muted button-small"
                    onClick={() =>
                      history.push(CHECKOUT_STEP_1, {
                        fromAction: true,
                      })
                    }
                    type="button"
                  >
                    <ArrowLeftOutlined />
                    &nbsp; Go Back
                  </button>
                  <button
                    className="button button-icon button-small"
                    type="submit"
                    disabled={!isValid || values.shippingCharges === null}
                  >
                    Next Step &nbsp;
                    <ArrowRightOutlined />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Boundary>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
  }).isRequired,
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
    isDone: PropType.bool,
  }).isRequired,
};

export default withCheckout(ShippingDetails);
