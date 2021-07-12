import React from "react";
// import styled from "styled-components";
// import colors from "@codedrops/react-ui";
// import { Spin } from "antd";
import Navigation from "./Navigation";

// const StyledHeader = styled.div`
//   position: sticky;
//   background: ${colors.feather};
//   top: 0;
//   z-index: 1;
//   margin-bottom: 10px;
//   box-shadow: 4px 4px 4px ${colors.strokeOne};
//   padding: 0 12px;
//   header {
//     padding: 10px 0;
//     max-width: 450px;
//     width: 100%;
//     margin: 0 auto;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     position: relative;
//     h2 {
//       font-size: 1.2rem;
//     }
//   }
// `;

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
