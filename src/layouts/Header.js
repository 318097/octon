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
  @media (max-width: 480px) {
    flex-direction: column;
    padding-bottom: 12px;
  }
  h2 {
    font-size: 2rem;
    .first-letter {
      font-size: 2.8rem;
      &:after {
        bottom: 6px;
      }
    }
    .extension {
      color: ${colors.gray};
    }
  }
`;

const Header = ({ appLoading }) => (
  <StyledHeader>
    <h2>
      <span className="first-letter underline">B</span>rainbox
      <span className="extension">.in</span>&nbsp;
      {appLoading ? <Spin className="spinner" size="small" /> : null}
    </h2>
    <Navigation />
  </StyledHeader>
);

export default Header;
