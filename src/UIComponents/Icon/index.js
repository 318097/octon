import React from "react";
import styled from "styled-components";
import colors from "../../colors";
import {
  Plus,
  Google,
  Logout,
  Login,
  Minus,
  Edit,
  Delete,
  Check,
  Drop,
  CaretLeft,
  Wallet
} from "./icon-svgs";

const StyledIcon = styled.span`
  line-height: 1;
  cursor: pointer;
  display: inline-block;
  /* border-radius: 50%; */
  margin: 2px;
  /* padding: ${({ background }) => (background ? "4px" : 0)}; */
  /* background: ${({ background }) => (background ? colors.grey : "none")}; */
  vertical-align: middle;
  transition: 0.4s;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  svg {
    display: inline-block;
    font-family: initial;
    fill: ${({ color }) => color};
    /* position: relative; */
    /* top: 1; */
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  /* &:hover {
    background: ${colors.shade2};
  } */
`;

const SVGIcon = ({ type, ...props }) => {
  switch (type) {
    case "plus":
      return <Plus {...props} />;
    case "google":
      return <Google {...props} />;
    case "logout":
      return <Logout {...props} />;
    case "login":
      return <Login {...props} />;
    case "minus":
      return <Minus {...props} />;
    case "edit":
      return <Edit {...props} />;
    case "delete":
      return <Delete {...props} />;
    case "check":
      return <Check {...props} />;
    case "drop":
      return <Drop {...props} />;
    case "caret-left":
      return <CaretLeft {...props} />;
    case "wallet":
      return <Wallet {...props} />;
    default:
      return <Minus {...props} />;
  }
};

const Icon = ({
  className,
  onClick,
  background = false,
  type,
  size = 16,
  color = "black"
}) => (
  <StyledIcon
    className={className}
    background={background}
    size={size}
    onClick={onClick}
    color={color}
  >
    <SVGIcon type={type} height={size} width={size} />
  </StyledIcon>
);

export default Icon;
