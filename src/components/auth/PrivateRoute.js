import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { sendAppNotification } from "../../store/app/actions";

import { isLoggedIn } from "../../authService";

const PrivateRoute = ({ component: Component, dispatch, ...rest }) => {
  useEffect(() => {
    if (!isLoggedIn())
      dispatch(sendAppNotification({ message: "Please login to continue." }));
  }, [Component, dispatch]);

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default connect()(PrivateRoute);
