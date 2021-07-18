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
import { setSession } from "./store/actions";
import Routes from "./routes";
import handleError from "./lib/errorHandler";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["authorization"] = sessionManager.getToken();
axios.defaults.headers.common["external-source"] = "OCTON";

const App = ({ setSession, appLoading, history }) => {
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (sessionManager.hasToken()) {
        try {
          const token = sessionManager.getToken();
          const { data } = await axios.post(`/auth/account-status`, { token });
          setSession({ isAuthenticated: true, info: "ON_LOAD", ...data });
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
    <div className="app" id="react-ui">
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

const mapDispatchToProps = { setSession };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
