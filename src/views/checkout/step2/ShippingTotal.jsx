import { useFormikContext } from "formik";
import { displayMoney } from "@/helpers/utils";
import PropType from "prop-types";
import { Tooltip } from "antd";
import { InfoCircleFilled } from "@ant-design/icons";
import React, { useEffect } from "react";
import { useShippingCharges } from "@/hooks";

const ShippingTotal = ({ subtotal }) => {
  const { values, setFieldValue } = useFormikContext();
  const shippingCharges = useShippingCharges(values.pinCode);

  useEffect(() => {
    setFieldValue("shippingCharges", shippingCharges);
  }, [shippingCharges]);

  const inProgress = shippingCharges === null;

  return (
    <div className="checkout-total d-flex-end padding-right-m">
      <table>
        <tbody>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Shipping: &nbsp;
              </span>
            </td>
            <td>
              <div
                style={{
                  display: "flex",
                  justifyContent: "right",
                  gap: "6px",
                }}
              >
                <h4 className="basket-total-amount text-subtle text-right margin-0 ">
                  {!inProgress
                    ? displayMoney(shippingCharges)
                    : "will be calculated once you enter address details"}
                </h4>
                <Tooltip
                  title="Shipping charges are calculated based on the delivery address"
                  placement="top"
                >
                  <InfoCircleFilled
                    size="5px"
                    style={{ color: "rgb(13, 148, 136)" }}
                  />
                </Tooltip>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Subtotal: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-subtle text-right margin-0">
                {displayMoney(subtotal)}
              </h4>
            </td>
          </tr>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Total: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-right">
                {!inProgress
                  ? displayMoney(Number(subtotal + shippingCharges))
                  : "will be calculated once you enter address details"}
              </h4>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ShippingTotal.propTypes = {
  subtotal: PropType.number.isRequired,
};

export default ShippingTotal;
