import React from "react";
import { EnvironmentOutlined } from "@ant-design/icons";

const LocationDisplay = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <EnvironmentOutlined /> <span>Hyderabad</span>
    </div>
  );
};

export default LocationDisplay;
