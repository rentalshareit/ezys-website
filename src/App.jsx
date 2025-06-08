/* eslint-disable react/forbid-prop-types */
import { Preloader } from "@/components/common";
import PropType from "prop-types";
import React, { StrictMode, useEffect } from "react";
import { Provider } from "react-redux";
import { ConfigProvider, App as AntApp } from "antd";
import { Helmet } from "react-helmet";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "@/routers/AppRouter";
import { waitForGlobal } from "@/helpers/utils";

const wa_btnSetting = {
  btnColor: "#0d9488",
  ctaText: "WhatsApp Us",
  cornerRadius: 40,
  marginBottom: 20,
  marginLeft: 20,
  marginRight: 20,
  btnPosition: "right",
  whatsAppNumber: "919032477570",
  welcomeMessage: "Hello, Can you please help me with more information.",
  zIndex: 59,
  btnColorScheme: "light",
};

const App = ({ store, persistor }) => {
  useEffect(() => {
    waitForGlobal("_waEmbed").then(() => {
      _waEmbed(wa_btnSetting);
    });
  }, []);

  return (
    <StrictMode>
      <ConfigProvider
        theme={{
          token: {
            colorError: "rgba(247, 45, 45, 0.986)",
            colorWarning: "rgb(228, 165, 31)",
            colorSuccess: "rgb(13, 148, 136)",
            colorInfo: "rgb(13, 148, 136)",
            fontSize: 12,
          },
          components: {
            Button: {
              colorTextLightSolid: "#FFF",
              colorPrimary: "rgb(13, 148, 136)",
              defaultBg: "rgb(13, 148, 136)",
              defaultBorder: "rgb(13, 148, 136)",
              defaultHoverBg: "rgb(9,103,95)",
              defaultActiveColor: "rgb(9,103,95)",
              defaultHoverColor: "rgb(9,103,95)",
              defaultActiveBorderColor: "rgb(9,103,95)",
              defaultHoverBorderColor: "rgb(9,103,95)",
              defaultActiveBg: "rgb(9,103,95)",
            },
            Input: {
              hoverBorderColor: "rgb(9,103,95)",
            },
            Table: {
              headerBg: "rgb(13, 148, 136)",
              headerColor: "#FFF",
            },
          },
        }}
      >
        <AntApp
          notification={{
            showProgress: true,
            pauseOnHover: true,
            placement: "topRight",
          }}
        >
          <Provider store={store}>
            <Helmet>
              <script
                async
                src="https://d2mpatx37cqexb.cloudfront.net/delightchat-whatsapp-widget/embeds/embed.min.js"
              ></script>
            </Helmet>
            <PersistGate loading={<Preloader />} persistor={persistor}>
              <AppRouter />
            </PersistGate>
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
