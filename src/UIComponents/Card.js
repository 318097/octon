import React from "react";
import styled from "styled-components";
import colors from "../colors";
const Wrapper = styled.div`
  background: ${colors.white};
  height: inherit;
  width: inherit;
  border-radius: 10px;
  border: 1px solid ${colors.bg};
  box-shadow: 3px 3px 3px ${colors.bg};
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
    background: ${colors.strokeTwo};
  }
`;

const Card = props => {
  return <Wrapper className="card">{props.children}</Wrapper>;
};

export default Card;
