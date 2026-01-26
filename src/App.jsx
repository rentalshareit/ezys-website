/* eslint-disable react/forbid-prop-types */
import { Preloader } from "@/components/common";
import PropType from "prop-types";
import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import { ConfigProvider, App as AntApp } from "antd";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "@/routers/AppRouter";
import PageFloaterActions from "@/components/misc/PageFloaterActions";
import PersistDataInitializer from "@/components/common/PersistDataInitializer";
import SubscriptionDisclaimer from "@/components/misc/SubscriptionDisclaimer";

const App = ({ store, persistor }) => {
  return (
    <StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorError: "rgba(247, 45, 45, 0.986)",
            colorWarning: "rgb(228, 165, 31)",
            colorSuccess: "rgb(13, 148, 136)",
            colorInfo: "rgb(13, 148, 136)",
            colorPrimary: "rgb(13, 148, 136)",
            colorLink: "rgb(13, 148, 136)",
            fontSize: 12,
            boxShadow: "none",
            boxShadowSecondary: "none",
          },
          Input: {
            boxShadow: "none",
          },
        }}
      >
        <AntApp
          notification={{
            showProgress: true,
            pauseOnHover: true,
            placement: "topRight",
          }}
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Provider store={store}>
            <PersistGate loading={<Preloader />} persistor={persistor}>
              <PersistDataInitializer />
              <SubscriptionDisclaimer />
              <AppRouter />
            </PersistGate>
            <PageFloaterActions />
          </Provider>
        </AntApp>
      </ConfigProvider>
    </StrictMode>
  );
};

App.propTypes = {
  store: PropType.any.isRequired,
  persistor: PropType.any.isRequired,
};

export default App;
