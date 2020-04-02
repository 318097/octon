import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Icon } from "../UIComponents";
import { connect } from "react-redux";
import styled from "styled-components";

import colors from "../colors";

import { getSession } from "../store/app/selectors";
import { setSession } from "../store/app/actions";

const StyledNavigation = styled.nav`
  text-align: center;
  a,
  .logout {
    font-size: 1.2rem;
    background: ${colors.white};
    text-decoration: none;
    text-align: center;
    transition: 0.8s;
    padding: 2px 6px;
    margin: 0 2px;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid ${colors.primary};
    color: ${colors.primary};
  }
  a:hover,
  .logout,
  a.active-link {
    color: ${colors.white};
    background: ${colors.primary};
  }
  .logout {
    opacity: 0.4;
  }
`;

const list = [
  { route: "/", label: "Home" },
  { route: "/expenses", label: "Expenses" },
  { route: "/todos", label: "Todos" },
  { route: "/goals", label: "Goals" },
  { route: "/timeline", label: "Timeline" },
  { route: "/posts", label: "Posts" }
];

const Navigation = ({ history, session = {}, setSession }) => {
  const logout = () => {
    setSession(null);
    localStorage.clear();
    history.push("/login");
  };

  const { loggedIn } = session || {};
  return (
    <StyledNavigation>
      {list.map(({ route, label }) => (
        <NavLink key={label} exact activeClassName="active-link" to={route}>
          {label}
        </NavLink>
      ))}
      {loggedIn ? (
        <NavLink to="#" className="logout" type="link" onClick={logout}>
          Logout
          {/* <Icon type="logout" /> */}
        </NavLink>
      ) : (
        <NavLink exact activeClassName="active-link" to="/login">
          Login
          {/* <Icon type="login" /> */}
        </NavLink>
      )}
    </StyledNavigation>
  );
};

const mapStateToProps = state => ({ session: getSession(state) });

const mapDispatchToProps = { setSession };

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
