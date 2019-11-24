import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Icon } from "antd";
import { connect } from 'react-redux';
import './Navigation.scss';

import { getSession } from '../store/app/selectors';
import { setSession } from '../store/app/actions';

const Navigation = ({ history, session, setSession }) => {
  const logout = () => {
    setSession(null);
    localStorage.clear();
    history.push("/login");
  };

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
      {
        session && session.loggedIn ?
          (
            <NavLink to="#" className="logout" type="link" onClick={logout}>
              Logout&nbsp;
              <Icon type="logout" />
            </NavLink>
          ) : (
            <NavLink exact activeClassName="active-link" to="/login">
              Login&nbsp;
              <Icon type="login" />
            </NavLink>
          )
      }
    </nav>
  );
};

const mapStateToProps = state => ({ session: getSession(state) });

const mapDispatchToProps = ({ setSession });

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation));
