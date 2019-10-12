/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { Spin } from "antd";
import axios from "axios";

import "antd/dist/antd.css";
import "./App.scss";

import Header from "./layouts/Header";
import Navigation from "./layouts/Navigation";

import PrivateRoute from "./components/auth/PrivateRoute";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PageNotFound from "./components/PageNotFound";
import Home from "./components/Home";
import Expenses from "./components/expense/Expenses";
import Todos from "./components/todos/Todos";
import Timeline from "./components/timeline/Timeline";
import Posts from "./components/posts/Posts";

import { getToken, isLoggedIn } from "./authService";
import config from "./config";

axios.defaults.baseURL = config.SERVER_URL;

const App = ({ history }) => {
  const [loginState, setLoginState] = useState({ loggedIn: false, info: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAccountActive = async () => {
      if (isLoggedIn()) {
        try {
          const token = getToken();
          await axios.post(`/auth/account-status`, { token });
          setLoginState({ loggedIn: true, info: "ON_LOAD" });
        } catch (err) {
          logout();
        }
      }
    };
    isAccountActive();
  }, []);

  useEffect(() => {
    if (loginState) {
      const setAxiosHeaderToken = () =>
        (axios.defaults.headers.common["authorization"] = getToken());
      setAxiosHeaderToken();
    }
    setTimeout(() => setLoading(false), 1000);
  }, [loginState]);

  const logout = () => {
    setLoginState({ loggedIn: false });
    localStorage.clear();
    history.push("/login");
  };

  return (
    <div className="app">
      <Header />
      <Navigation loginState={loginState} logout={logout} />
      {loading ? (
        <div className="content">
          <Spin />
        </div>
      ) : (
        <div className="content">
          <Switch>
            <Route
              exact
              path="/login"
              component={() => <Login setLoginState={setLoginState} />}
            />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/expenses" component={Expenses} />
            <PrivateRoute exact path="/todos" component={Todos} />
            <PrivateRoute exact path="/timeline" component={Timeline} />
            <PrivateRoute exact path="/posts" component={Posts} />
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      )}
    </div>
  );
};

export default withRouter(App);
