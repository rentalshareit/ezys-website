/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import PropType from "prop-types";
import React from "react";
import { Input } from "antd";

const CustomTextarea = ({
  field,
  form: { touched, errors },
  label,
  ...props
}) => (
  <div className="input-group">
    {touched[field.name] && errors[field.name] ? (
      <span className="label-input label-error">{errors[field.name]}</span>
    ) : (
      <label className="label-input" htmlFor={field.name}>
        {label}
      </label>
    )}
    <Input.TextArea
      name={field.name}
      cols={30}
      rows={4}
      id={field.name}
      status={touched[field.name] && errors[field.name] && "error"}
      {...field}
      {...props}
    />
  </div>
);

CustomTextarea.propTypes = {
  label: PropType.string.isRequired,
  field: PropType.object.isRequired,
  form: PropType.object.isRequired,
};

export default CustomTextarea;
