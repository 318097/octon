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
  flex-direction: column;
  justify-content: flex-end;
  height: max-content;
  border-radius: 4px;
  width: max-content;
  padding: 8px;
  background: ${colors.bar};
  a {
    font-size: 1.6rem;
    background: ${colors.white};
    transition: 0.4s;
    margin-bottom: 8px;
    cursor: pointer;
    border-radius: 2px;
    color: ${colors.primary};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    width: 26px;
  }
  a:hover,
  a.active-link {
    color: ${colors.white};
    background: ${colors.primary};
  }
`;

const list = [
  { route: "/expenses", label: "Expenses", icon: <Icon type="wallet" /> },
  { route: "/todos", label: "Todos", icon: <Icon type="unordered-list" /> },
  { route: "/goals", label: "Goals", icon: <Icon type="appstore" /> },
  { route: "/timeline", label: "Timeline", icon: <Icon type="hourglass" /> },
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
      {list.map(({ route, label, icon }) => (
        <NavLink key={label} exact activeClassName="active-link" to={route}>
          {icon}
        </NavLink>
      ))}
      {loggedIn ? (
        <NavLink to="#" type="link" onClick={logout}>
          <Icon type="logout" />
        </NavLink>
      ) : (
        <NavLink exact activeClassName="active-link" to="/login">
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
