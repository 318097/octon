import React from "react";
import Navigation from "./Navigation";

const Header = ({ history }) => (
  <div className="header-wrapper">
    <header>
      <h2 className="pointer" onClick={() => history.push("/")}>
        Atom
        {/* {appLoading ? <Spin className="spinner" size="small" /> : null} */}
      </h2>
      <Navigation />
    </header>
  </div>
);

export default Header;
