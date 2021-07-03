import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import colors from "@codedrops/react-ui";
import { getSession } from "../store/app/selectors";
import { setSession } from "../store/app/actions";
import { Icon } from "@ant-design/compatible";

const StyledNavigation = styled.nav`
  display: flex;
  gap: 4px;
  a {
    font-size: 1.4rem;
    background: transparent;
    transition: 0.4s;
    cursor: pointer;
    color: ${colors.bar};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    width: 26px;
    border-radius: 1px;
  }
  a:hover,
  a.active-link {
    color: ${colors.white};
    background: ${colors.primary};
  }

  a.auth {
    margin-left: 12px;
  }
`;

const routes = [
  { route: "/expenses", label: "Expenses", icon: <Icon type="wallet" /> },
  { route: "/tasks", label: "Tasks", icon: <Icon type="unordered-list" /> },
  { route: "/timeline", label: "Timeline", icon: <Icon type="hourglass" /> },
  {
    route: "/scratch-pad",
    label: "Scratch Pad",
    icon: <Icon type="file-text" />,
  },
  { route: "/settings", label: "Settings", icon: <Icon type="setting" /> },
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
      {routes.map(({ route, label, icon }) => (
        <NavLink key={label} exact activeClassName="active-link" to={route}>
          {icon}
        </NavLink>
      ))}
      {loggedIn ? (
        <NavLink className="auth" to="#" type="link" onClick={logout}>
          <Icon type="logout" />
        </NavLink>
      ) : (
        <NavLink
          className="auth"
          exact
          activeClassName="active-link"
          to="/login"
        >
          <Icon type="login" />
        </NavLink>
      )}
    </StyledNavigation>
  );
};

const mapStateToProps = (state) => ({ session: getSession(state) });

const mapDispatchToProps = { setSession };

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
