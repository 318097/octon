import React from "react";
import styled from 'styled-components';

import Navigation from "./Navigation";

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  h2 {
    font-weight: bold;
    margin: 0;
  }
`

const Header = () => (
  <StyledHeader>
    <h2>Brainbox</h2>
    <Navigation />
  </StyledHeader>
);

export default Header;
