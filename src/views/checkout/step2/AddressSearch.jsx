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
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
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
