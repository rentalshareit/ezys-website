import React from "react";
import { Boundary } from "@/components/common";
import { ArrowRightOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import AddressLocator from "./AddressLocator";
import { add } from "date-fns";

const AddressSearch = ({ onSubmit }) => {
  const [address, setAddress] = React.useState();

  return (
    <Boundary>
      <div className="checkout-step-2">
        <AddressLocator
          apiKey="AIzaSyCiC5Miz0vfZc_-7xyj6hI9eCIwSAyg-wk"
          onSelect={(a) => setAddress(a)}
        />
        <div
          className="checkout-shipping-action"
          style={{ justifyContent: "center" }}
        >
          <button
            className="button button-icon button-small"
            disabled={!address}
            onClick={() => onSubmit(address)}
            type="button"
          >
            Confirm & Proceed &nbsp;
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    </Boundary>
  );
};

AddressSearch.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddressSearch;
