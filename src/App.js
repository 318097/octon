import React from "react";
import { Switch, Route, BrowserRouter, Link } from "react-router-dom";
import "./App.scss";
import "antd/dist/antd.css";
import axios from "axios";

import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Expenses from "./components/Expenses";
import Todos from "./components/Todos";
import PageNotFound from "./components/PageNotFound";

import config from "./config";

axios.defaults.baseURL = config.SERVER_URL;
axios.defaults.headers.common["authorization"] =
  localStorage.getItem("bbox-token") || "";

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="app-header">
          <h2>Brainbox</h2>
        </header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/todos">Todos</Link>
          <Link to="/login">Login</Link>
        </nav>
        <div>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <PrivateRoute exact path="/expenses" component={Expenses} />
            <PrivateRoute exact path="/todos" component={Todos} />
            <Route exact path="/" component={Home} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
