import React from "react";
import styled from "styled-components";

const Container = styled.div`
  font-size: 2.2rem;
  text-transform: uppercase;
  text-align: center;
`;

const PageNotFound = () => (
  <section>
    <Container>404: Page Not Found</Container>
  </section>
);

export default PageNotFound;
