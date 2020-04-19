import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { Spin, message } from "antd";
import axios from "axios";
import { connect } from "react-redux";

import "antd/dist/antd.css";
import "./App.scss";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

import PrivateRoute from "./components/auth/PrivateRoute";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PageNotFound from "./components/PageNotFound";
import Home from "./components/Home";
import Expenses from "./components/expense/Expenses";
import Todos from "./components/todos/Todos";
import Goals from "./components/goals/Goals";
import Timeline from "./components/timeline/Timeline";
import Posts from "./components/posts/Posts";
import PostView from "./components/posts/PostView";
import ComponentList from "./components/test/ComponentList";

import { getToken, isLoggedIn } from "./authService";
import config from "./config";

import { getSession } from "./store/app/selectors";
import { setSession, sendAppNotification } from "./store/app/actions";

axios.defaults.baseURL = config.SERVER_URL;

const App = ({ session, setSession, appNotification }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (isLoggedIn()) {
        try {
          const token = getToken();
          await axios.post(`/auth/account-status`, { token });
          setSession({ loggedIn: true, info: "ON_LOAD" });
        } catch (err) {
          sendAppNotification();
        }
      } else setLoading(false);
    };
    isAccountActive();
  }, []);

  useEffect(() => {
    if (session && session.loggedIn) {
      axios.defaults.headers.common["authorization"] = getToken();
      setTimeout(() => setLoading(false), 200);
    }
  }, [session]);

  useEffect(() => {
    if (appNotification) {
      const { type, message: msg } = appNotification;
      if (type === "error") message.error(msg);
      else if (type === "success") message.success(msg);
    }
  }, [appNotification]);

  return (
    <div className="app">
      <Header />
      <div className="content">
        {loading ? (
          <Spin />
        ) : (
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/expenses" component={Expenses} />
            <PrivateRoute exact path="/todos" component={Todos} />
            <PrivateRoute exact path="/goals" component={Goals} />
            <PrivateRoute exact path="/timeline" component={Timeline} />
            <Route exact path="/posts" component={Posts} />
            <Route exact path="/posts/:id" component={PostView} />
            <Route exact path="/ui" component={ComponentList} />
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound} />
          </Switch>
        )}
      </div>
      <Footer />
    </div>
  );
};

const mapStateToProps = (state) => ({
  session: getSession(state),
  appNotification: state.app.appNotification,
});

const mapDispatchToProps = { setSession };

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
