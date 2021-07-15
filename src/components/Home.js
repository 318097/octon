import React from "react";
import routes from "../constants";
import { Card } from "antd";
import { withRouter } from "react-router";

const Home = ({ history }) => (
  <section id="home">
    {routes({ filterKey: "showInHomePage" }).map(
      ({ label, description, route }) => (
        <Card
          className="pointer"
          key={label}
          onClick={() => history.push(route)}
        >
          <div className="">{label}</div>
          <div className="">{description}</div>
        </Card>
      )
    )}
  </section>
);

export default withRouter(Home);
