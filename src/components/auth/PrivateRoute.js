import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import { sendAppNotification } from "../../store/app/actions";

const PrivateRoute = ({
  component: Component,
  dispatch,
  isAuthenticated,
  ...rest
}) => {
  useEffect(() => {
    if (!isAuthenticated)
      dispatch(sendAppNotification({ message: "Please login to continue." }));
  }, [Component, dispatch]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: _.get(state, "app.session.isAuthenticated"),
});

export default connect(mapStateToProps)(PrivateRoute);
