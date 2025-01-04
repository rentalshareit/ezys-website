import { LoadingOutlined } from "@ant-design/icons";
import PropType from "prop-types";
import { Spin } from "antd";
import React, { useState } from "react";

const ImageLoader = ({ src, alt, className, loaderStyle }) => {
  const loadedImages = {};
  const [loaded, setLoaded] = useState(loadedImages[src]);

  const onLoad = () => {
    loadedImages[src] = true;
    setLoaded(true);
  };

  return (
    <>
      {!loaded && (
        <div className="ezys-spinner" style={loaderStyle}>
          <Spin size="large" />
        </div>
      )}
      <img
        alt={alt || ""}
        className={`${className || ""} ${
          loaded ? "is-img-loaded" : "is-img-loading"
        }`}
        onLoad={onLoad}
        src={src}
      />
    </>
  );
};

ImageLoader.defaultProps = {
  className: "image-loader",
  loaderStyle: {},
};

ImageLoader.propTypes = {
  src: PropType.string.isRequired,
  alt: PropType.string,
  className: PropType.string,
  loaderStyle: PropType.shape({}),
};

export default ImageLoader;
