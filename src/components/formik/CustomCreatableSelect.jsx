/* eslint-disable react/forbid-prop-types */
import { useField } from "formik";
import PropType from "prop-types";
import React from "react";
import { Select } from "antd";

const CustomCreatableSelect = (props) => {
  const [field, meta, helpers] = useField(props);
  const {
    options,
    defaultValue,
    label,
    placeholder,
    isMulti,
    type,
    iid,
    ...rest
  } = props;
  const { touched, error } = meta;
  const { setValue } = helpers;

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className="input-group">
      {touched && error ? (
        <span className="label-input label-error">{error}</span>
      ) : (
        <label className="label-input" htmlFor={field.name}>
          {label}
        </label>
      )}
      <Select
        mode={isMulti ? "multiple" : "default"}
        placeholder={placeholder}
        name={field.name}
        id="{iid || field.name}"
        defaultValue={defaultValue}
        onChange={handleChange}
        options={options}
        {...rest}
      />
    </div>
  );
};

CustomCreatableSelect.defaultProps = {
  isMulti: false,
  placeholder: "",
  iid: "",
  options: [],
  type: "string",
};

CustomCreatableSelect.propTypes = {
  options: PropType.arrayOf(PropType.object),
  defaultValue: PropType.oneOfType([PropType.object, PropType.array])
    .isRequired,
  label: PropType.string.isRequired,
  placeholder: PropType.string,
  isMulti: PropType.bool,
  type: PropType.string,
  iid: PropType.string,
};

export default CustomCreatableSelect;
