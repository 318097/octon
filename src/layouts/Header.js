import React from "react";
import styled from "styled-components";
import colors from "@codedrops/react-ui";
import { Spin } from "antd";
import Navigation from "./Navigation";

const StyledHeader = styled.div`
  position: sticky;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  background: ${colors.feather};
  top: 0;
  z-index: 1;
  margin-bottom: 10px;
  box-shadow: 4px 4px 4px ${colors.strokeOne};
  padding: 10px 0;
  header {
    max-width: 450px;
    width: 100%;
    margin: 0 auto;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }
`;

const Header = ({ appLoading }) => (
  <StyledHeader>
    <header>
      <h2>
        Atom
        {/* {appLoading ? <Spin className="spinner" size="small" /> : null} */}
      </h2>
      <Navigation />
    </header>
  </StyledHeader>
);

export default Header;
