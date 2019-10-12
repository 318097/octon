import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "antd";

import "./Navigation.scss";

const Navigation = ({ loginState, logout }) => {
  return (
    <nav>
      <NavLink exact activeClassName="active-link" to="/">
        Home
      </NavLink>
      <NavLink exact activeClassName="active-link" to="/expenses">
        Expenses
      </NavLink>
      <NavLink exact activeClassName="active-link" to="/todos">
        Todos
      </NavLink>
      <NavLink exact activeClassName="active-link" to="/timeline">
        Timeline
      </NavLink>
      <NavLink exact activeClassName="active-link" to="/posts">
        Posts
      </NavLink>
      {loginState.loggedIn ? (
        <NavLink to="#" className="logout" type="link" onClick={logout}>
          Logout&nbsp;
          <Icon type="logout" />
        </NavLink>
      ) : (
        <NavLink exact activeClassName="active-link" to="/login">
          Login&nbsp;
          <Icon type="login" />
        </NavLink>
      )}
    </nav>
  );
};

export default Navigation;
