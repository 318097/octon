import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import colors from "../../madDesign/colors";

const Wrapper = styled.div`
  background: ${colors.white};
  min-height: 100px;
  min-width: 120px;
  display: inline-block;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${colors.bg};
  box-shadow: 3px 3px 3px ${colors.bg};
  transition: 0.3s;
  position: relative;
  overflow: auto;
`;

const Card = ({
  children,
  style,
  className = "card",
  curved = true,
  bottomLine = true,
}) => {
  const classes = classNames({
    "curve-border": curved,
    "bottom-line": bottomLine,
  });
  return <Wrapper className={`${classes} ${className}`}>{children}</Wrapper>;
};

export default Card;
