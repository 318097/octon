import React from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoute from "./components/auth/PrivateRoute";
import Login from "./components/auth/Login";
import Home from "./components/Home";
import Register from "./components/auth/Register";
import PageNotFound from "./components/PageNotFound";
import Expenses from "./components/expense/Expenses";
import Tasks from "./components/tasks/Tasks";
import ScratchPad from "./components/scratchPad/ScratchPad";
import Timeline from "./components/timeline/Timeline";
import Settings from "./components/settings";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <PrivateRoute exact path="/expenses" component={Expenses} />
      <PrivateRoute exact path="/tasks" component={Tasks} />
      <PrivateRoute exact path="/scratch-pad" component={ScratchPad} />
      <PrivateRoute exact path="/timeline" component={Timeline} />
      <PrivateRoute exact path="/settings" component={Settings} />
      <Route exact path="/" component={Home} />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
