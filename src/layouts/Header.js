import React from "react";
import styled from "styled-components";

import Navigation from "./Navigation";

const StyledHeader = styled.header`
  display: flex;
  position: sticky;
  z-index: 10;
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  @media (max-width: 480px) {
    flex-direction: column;
    padding-bottom: 12px;
  }
  h2 {
    margin: 0;
    .first-letter {
      font-size: 150%;
      font-weight: bold;
      &:after {
        bottom: 9px;
      }
    }
    .extension {
      color: gray;
    }
  }
`;

const Header = () => (
  <StyledHeader>
    <h2>
      <span className="first-letter custom-header">B</span>rainbox
      <span className="extension">.in</span>
    </h2>
    <Navigation />
  </StyledHeader>
);

export default Header;
