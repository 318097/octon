import React from "react";
import styled from "styled-components";

const StyledPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 4px;
`;

const PageHeader = props => (
  <StyledPageHeader>{props.children}</StyledPageHeader>
);

export default PageHeader;
