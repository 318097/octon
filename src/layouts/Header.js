import React from "react";
import styled from "styled-components";
import colors from "@codedrops/react-ui";
import { Spin } from "antd";
import Navigation from "./Navigation";

const StyledHeader = styled.header`
  display: flex;
  position: sticky;
  z-index: 10;
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
`;

const Header = ({ appLoading }) => (
  <StyledHeader>
    <h2>
      Atom
      {appLoading ? <Spin className="spinner" size="small" /> : null}
    </h2>
    <Navigation />
  </StyledHeader>
);

export default Header;
