import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { Spin, message } from "antd";
import axios from "axios";
// import _ from "lodash";
import { connect } from "react-redux";

import "antd/dist/antd.css";
import "./App.scss";

import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import PageNotFound from "./components/PageNotFound";
import Expenses from "./components/expense/Expenses";
import Tasks from "./components/tasks/Tasks";
import ScratchPad from "./components/scratchPad/ScratchPad";
import Timeline from "./components/timeline/Timeline";
import Settings from "./components/settings";

import Navigation from "./layouts/Navigation";
import { getToken, hasToken } from "./authService";
import config from "./config";
import { getSession } from "./store/app/selectors";
import { setSession, sendAppNotification } from "./store/app/actions";
import { setData } from "./store/data/actions";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["authorization"] = getToken();
axios.defaults.headers.common["external-source"] = "ATOM";

const App = ({ setSession, appNotification, appLoading, setData }) => {
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
        {loading ? (
          <Spin className="loader" />
        ) : (
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/expenses" component={Expenses} />
            <PrivateRoute exact path="/tasks" component={Tasks} />
            <PrivateRoute exact path="/scratch-pad" component={ScratchPad} />
            <PrivateRoute exact path="/timeline" component={Timeline} />
            <PrivateRoute exact path="/settings" component={Settings} />
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound} />
          </Switch>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  session: getSession(state),
  appNotification: state.app.appNotification,
  appLoading: state.app.appLoading,
});

const mapDispatchToProps = { setSession, setData };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
