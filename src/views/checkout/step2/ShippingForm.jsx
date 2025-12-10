/* eslint-disable jsx-a11y/label-has-associated-control */
import { CustomInput, CustomTextarea, CustomSelect } from "@/components/formik";
import { Field, useFormikContext } from "formik";
import React, { useEffect } from "react";
import { updateMiscCharges } from "@/redux/actions/checkoutActions";

const deliveryTimeSlots = [
  { label: "10 AM - 1 PM", value: "10-13" },
  { label: "7 PM - 10 PM", value: "19-22" },
];

const ShippingForm = () => {
  const { values } = useFormikContext();
  const shippingAddress = values?.address?.address;

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
              name="flatOrHouseNumber"
              type="text"
              label="* Flat/House Number"
              placeholder="Enter your flat or house number"
              component={CustomInput}
              style={{ marginRight: "8px" }}
            />
          </div>
          <div className="d-block checkout-field">
            <Field
              name="buildingName"
              type="text"
              label="Building Name"
              placeholder="Enter your building name"
              component={CustomInput}
            />
          </div>
        </div>
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="address"
              label="* Shipping Location"
              disabled
              value={shippingAddress}
              component={CustomTextarea}
            />
          </div>
        </div>
        <div className="checkout-fieldset">
          <div className="checkout-field">
            <CustomSelect
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
