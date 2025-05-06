import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import classNames from "classnames";
import { displayMoney } from "@/helpers/utils";
import WithModalKyc from "@/components/common/Kyc";

function capitalizeFirstLetter(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const UserOrdersTab = () => {
  const [data, setData] = useState();
  const [kycOrderId, setKycOrderId] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const profile = useSelector((state) => state.profile);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    async function getData() {
      const { value, countryCode } = profile.mobile;
      const phone = value.substr(
        value.indexOf(countryCode) + countryCode.length
      );
      setLoading(true);
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbxlC2R1EPoKBW65eSoy31fZUbZgMI1prYuG77P5C2guSvUj26bRtKT--JccFVQz5vw/exec?action=getOrders&phone=${phone}`
      );
      const data = await response.json();

      setData(data);
      setLoading(false);
    }
    getData();
    // Get orders history of a number
  }, []);

  if (loading)
    return (
      <div
        className="ezys-spinner"
        style={{ height: "unset", margin: "10px 0" }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <div
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        maxHeight: "45rem",
        overflow: "auto",
      }}
    >
      {data && data.length
        ? data.map((d) => {
            return (
              <div
                key={d.orderId}
                style={{
                  border: "solid 1px #e1e1e1",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  boxShadow: "1px 1px #e1e1e1",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingBottom: "1rem",
                    }}
                  >
                    <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                      Order Id: <span>{d.orderId}</span>
                    </span>
                    <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                      Order Date : <span>{d.orderDate}</span>
                    </span>
                    <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                      Payment Mode: <span>{d.paymentMode}</span>
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      paddingBottom: "1rem",
                      gap: "2rem",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                      Rental Period: <span>{d.rentalPeriod}</span>
                    </span>
                    <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                      Status:{" "}
                      <span style={{ color: "rgb(13, 148, 136)" }}>
                        {capitalizeFirstLetter(d.status)}
                      </span>
                    </span>
                  </div>
                </div>
                {(d.status === "kyc_pending" || d.status === "kyc_failed") && (
                  <button
                    className="button button-small"
                    style={{ marginBottom: "1rem" }}
                    onClick={() => setKycOrderId(d.orderId)}
                    type="button"
                  >
                    Start Kyc
                  </button>
                )}
                <div>
                  <table className="user-orders-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price Per Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.items.map((item, i) => (
                        <tr>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                    alignContent: "flex-end",
                    alignItems: "flex-end",
                    padding: "1rem 0rem",
                    borderTop: "solid #e1e1e1 1px",
                    marginTop: "2rem",
                  }}
                >
                  <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                    Total Rental Days: <span>{d.rentalDays}</span>
                  </span>
                  <span
                    style={{
                      color: "#818181",
                      fontSize: "1.4rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Total Price:{" "}
                    <span>
                      {displayMoney(
                        d.items.reduce(
                          (acc, i) => acc + i.price * i.quantity,
                          0
                        ) * d.rentalDays
                      )}
                    </span>
                  </span>
                  <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                    Shipping Charges: <span>{displayMoney(0)}</span>
                  </span>
                  <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                    Discount:{" "}
                    <span>
                      {displayMoney(
                        d.items.reduce(
                          (acc, i) => acc + i.price * i.quantity,
                          0
                        ) *
                          d.rentalDays -
                          d.totalPrice
                      )}
                    </span>
                  </span>
                  <span style={{ color: "#818181", fontSize: "1.4rem" }}>
                    Net Price: <span>{displayMoney(d.totalPrice)}</span>
                  </span>
                </div>
              </div>
            );
          })
        : loading
        ? null
        : "No orders found"}
      <WithModalKyc
        show={!!kycOrderId}
        onClose={() => setKycOrderId(null)}
        orderId={kycOrderId}
      />
    </div>
  );
};

export default UserOrdersTab;
