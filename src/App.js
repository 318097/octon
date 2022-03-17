import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Spin } from "antd";
import axios from "axios";
import { connect } from "react-redux";

import "antd/dist/antd.css";
import "./App.scss";
import tracking from "./lib/mixpanel";
import Header from "./layouts/Header";
import sessionManager from "./lib/sessionManager";
import config from "./config";
import { fetchSession } from "./store/actions";
import Routes from "./routes";
import handleError from "./lib/errorHandler";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["authorization"] =
  sessionManager.getToken() || "";
axios.defaults.headers.common["external-source"] = "OCTON";

const App = ({ appLoading, history, fetchSession }) => {
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (sessionManager.hasToken()) {
        try {
          await fetchSession();
        } catch (error) {
          handleError(error);
        } finally {
          setTimeout(() => setInitLoading(false), 300);
        }
      } else setInitLoading(false);
    };
    tracking.track("INIT", { path: window.location.pathname });
    isAccountActive();
  }, []);

  return (
    <div className="app react-ui">
      <Header history={history} appLoading={appLoading} />
      {initLoading ? (
        <Spin className="loader" />
      ) : (
        <div className="section-wrapper">
          <Routes />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ session, appLoading }) => ({
  session,
  appLoading,
});

const mapDispatchToProps = { fetchSession };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
