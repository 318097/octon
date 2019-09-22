import React, { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.scss";
import axios from "axios";
import { Icon, Button, Spin } from "antd";
import { withRouter } from "react-router-dom";

import "antd/dist/antd.css";

import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Expenses from "./components/Expenses";
import Todos from "./components/Todos";
import PageNotFound from "./components/PageNotFound";
import { getToken, isLoggedIn } from "./authService";
import config from "./config";

axios.defaults.baseURL = config.SERVER_URL;

const App = ({ history }) => {
  const [loginState, setLoginState] = useState({ loggedIn: false, info: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = isLoggedIn();
    setLoginState({ loggedIn, info: "ACTIVE" });
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
    localStorage.clear();
    history.push("/login");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h2>Brainbox</h2>
      </header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/todos">Todos</Link>
        {loginState ? (
          <Button type="link" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
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
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      )}
    </div>
  );
};

export default withRouter(App);
