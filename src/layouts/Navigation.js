import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import colors from "@codedrops/react-ui";
import { setSession } from "../store/actions";
import { Icon } from "@ant-design/compatible";
import routes from "../constants";
import tracking from "../lib/mixpanel";

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

const Navigation = ({ history, session = {}, setSession }) => {
  const logout = () => {
    tracking.track("LOGOUT");
    tracking.reset();
    setSession(null);
    localStorage.clear();
    history.push("/login");
  };

  const { isAuthenticated } = session || {};

  return (
    <StyledNavigation>
      {routes({ filterKey: "showInNavBar", isAuthenticated }).map(
        ({ route, label, icon }) => (
          <NavLink
            key={label}
            exact
            activeClassName="active-link"
            to={route}
            onClick={() => tracking.track("NAVIGATION", { name: label })}
          >
            {icon}
          </NavLink>
        )
      )}
      {isAuthenticated ? (
        <NavLink className="auth" to="#" type="link" onClick={logout}>
          <Icon type="logout" />
        </NavLink>
      ) : (
        <NavLink
          className="auth"
          exact
          activeClassName="active-link"
          to="/login"
          onClick={() =>
            tracking.track("CLICK_ACTION", { target: "login icon" })
          }
        >
          <Icon type="login" />
        </NavLink>
      )}
    </StyledNavigation>
  );
};

const mapStateToProps = ({ session }) => ({ session });

const mapDispatchToProps = { setSession };

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
