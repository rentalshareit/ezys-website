/* eslint-disable react/no-multi-comp */
import { LoadingOutlined } from "@ant-design/icons";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import { Spin } from "antd";
import React, { lazy, Suspense } from "react";
import UserTab from "../components/UserTab";

const UserAccountTab = lazy(() => import("../components/UserAccountTab"));
const UserWishListTab = lazy(() => import("../components/UserWishListTab"));
const UserOrdersTab = lazy(() => import("../components/UserOrdersTab"));

const Loader = () => (
  <div className="loader" style={{ minHeight: "80vh" }}>
    <div className="ezys-spinner">
      <Spin size="large" />
      <h6>Loading ... </h6>
    </div>
  </div>
);

const UserAccount = () => {
  useScrollTop();
  useDocumentTitle("My Account | Ezys");

  return (
    <UserTab>
      <div index={0} label="Account">
        <Suspense fallback={<Loader />}>
          <UserAccountTab />
        </Suspense>
      </div>
      <div index={1} label="My Orders">
        <Suspense fallback={<Loader />}>
          <UserOrdersTab />
        </Suspense>
      </div>
    </UserTab>
  );
};

export default UserAccount;
