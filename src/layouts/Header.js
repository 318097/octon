import React from "react";
import Navigation from "./Navigation";
import { Spin } from "antd";

const Header = ({ history, appLoading }) => (
  <div className="header-wrapper">
    <header>
      <h2
        className="pointer gap-8 flex center"
        onClick={() => history.push("/")}
      >
        Octon
        {appLoading ? <Spin size="small" /> : null}
      </h2>
      <Navigation />
    </header>
  </div>
);

export default Header;
