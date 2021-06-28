import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Spin, message } from "antd";
import axios from "axios";
import { connect } from "react-redux";

import "antd/dist/antd.css";
import "./App.scss";

import Navigation from "./layouts/Navigation";
import { getToken, hasToken } from "./lib/authService";
import config from "./config";
import { getSession } from "./store/app/selectors";
import { setSession, sendAppNotification } from "./store/app/actions";
import Routes from "./routes";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["authorization"] = getToken();
axios.defaults.headers.common["external-source"] = "ATOM";

const App = ({ setSession, appNotification, appLoading }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (hasToken()) {
        try {
          const token = getToken();
          const { data } = await axios.post(`/auth/account-status`, { token });
          setSession({ loggedIn: true, info: "ON_LOAD", ...data });
        } catch (err) {
          sendAppNotification();
        } finally {
          setTimeout(() => setLoading(false), 300);
        }
      } else setLoading(false);
    };
    isAccountActive();
  }, []);

  useEffect(() => {
    if (appNotification) {
      const { type, message: msg } = appNotification;
      if (type === "error") message.error(msg);
      else if (type === "success") message.success(msg);
    }
  }, [appNotification]);

  return (
    <div className="app" id="react-ui">
      <div className="content">
        <Navigation />
        {loading ? <Spin className="loader" /> : <Routes />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  session: getSession(state),
  appNotification: state.app.appNotification,
  appLoading: state.app.appLoading,
});

const mapDispatchToProps = { setSession };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
