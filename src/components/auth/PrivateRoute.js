import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import notify from "../../lib/notify";

const PrivateRoute = ({
  component: Component,
  dispatch,
  isAuthenticated,
  ...rest
}) => {
  useEffect(() => {
    if (!isAuthenticated) notify("Please login to continue.");
  }, [Component]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const mapStateToProps = ({ session }) => ({
  isAuthenticated: _.get(session, "isAuthenticated"),
});

export default connect(mapStateToProps)(PrivateRoute);
