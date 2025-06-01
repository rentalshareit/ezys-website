/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  CustomInput,
  CustomTextarea,
  CustomCreatableSelect,
} from "@/components/formik";
import { Field, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { updateMiscCharges } from "@/redux/actions/checkoutActions";

const deliveryTimeSlots = [
  { label: "11 AM - 1 PM", value: "11-13" },
  { label: "1 PM - 3 PM", value: "13-15" },
  { label: "3 PM - 5 PM", value: "15-17" },
  { label: "5 PM - 7 PM", value: "17-19" },
  { label: "7 PM - 9 PM", value: "19-21" },
  { label: "9 PM - 11 PM", value: "21-23" },
];

const ShippingForm = () => {
  const { values } = useFormikContext();

  return (
    <div className="checkout-shipping-wrapper">
      <div className="checkout-shipping-form">
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="fullname"
              type="text"
              label="* Full Name"
              placeholder="Enter your full name"
              component={CustomInput}
              style={{ textTransform: "capitalize" }}
            />
          </div>
          <div className="d-block checkout-field">
            <Field
              name="email"
              type="email"
              label="* Email Address"
              placeholder="Enter your email address"
              component={CustomInput}
            />
          </div>
        </div>
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="address"
              label="* Shipping Address"
              placeholder="Enter full shipping address"
              component={CustomTextarea}
            />
          </div>
          <div className="d-block checkout-field">
            <Field
              name="pinCode"
              type="number"
              label="* Pin Code"
              placeholder="Enter your pin code"
              component={CustomInput}
            />
          </div>
        </div>
        <div className="checkout-fieldset">
          <div className="checkout-field">
            <CustomCreatableSelect
              name="deliveryTimeSlot"
              id="deliveryTimeSlot"
              options={deliveryTimeSlots}
              placeholder="Choose Delivery Time Slot"
              label="Delivery Time Slot"
              value={deliveryTimeSlots.find(
                (o) => o.value === values.deliveryTimeSlot
              )}
              styles={{
                control: {
                  borderColor: "#cacaca!important",
                  boxShadow: "none",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
