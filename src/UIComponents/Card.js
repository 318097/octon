import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background: white;
  height: inherit;
  width: inherit;
  border-radius: 10px;
  border: 1px solid #f2f2f2;
  box-shadow: 3px 3px 3px #f2f2f2;
  transition: 1s;
  position: relative;
  overflow: hidden;
  &:after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 5px;
    background: lightgrey;
  }
`;

const Card = props => {
  return <Wrapper className="card">{props.children}</Wrapper>;
};

export default Card;
