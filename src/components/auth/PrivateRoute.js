import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";

import { sendAppNotification } from "../../store/app/actions";

const PrivateRoute = ({
  component: Component,
  dispatch,
  loggedIn,
  ...rest
}) => {
  useEffect(() => {
    if (!loggedIn)
      dispatch(sendAppNotification({ message: "Please login to continue." }));
  }, [Component, dispatch]);

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedIn ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const mapStateToProps = (state) => ({
  loggedIn: _.get(state, "app.session.loggedIn"),
});

export default connect(mapStateToProps)(PrivateRoute);
