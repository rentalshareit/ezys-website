import React from "react";
import { Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideOOSProducts } from "@/redux/actions/miscActions";

const HideOOSToggle = () => {
  const dispatch = useDispatch();
  const hideOutOfStock = useSelector((state) => state.app.hideOutOfStock);

  const handleChange = (checked) => {
    dispatch(hideOOSProducts({ hideOutOfStock: checked }));
  };

  return (
    <Switch
      checked={hideOutOfStock}
      onChange={handleChange}
      checkedChildren="Hide OOS"
      unCheckedChildren="Show all"
    />
  );
};

export default HideOOSToggle;
