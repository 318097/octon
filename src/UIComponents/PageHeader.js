import React from "react";
import styled from "styled-components";

const StyledPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 6px 0;
`;

const PageHeader = props => (
  <StyledPageHeader>{props.children}</StyledPageHeader>
);

export default PageHeader;
