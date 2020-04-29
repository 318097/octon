import React from "react";
import styled from "styled-components";
import colors from "../../magicdust/colors";

const getThemeColors = (property) => ({ theme, type }) => {
  let value = {};
  switch (theme) {
    case "default":
      if (type === "solid") {
        value = {
          border_hover: colors.orchid,
          border: colors.orchid,
          background: colors.bg,
          color: colors.orchid,
          background_hover: colors.orchid,
          color_hover: colors.bg,
        };
      } else if (type === "hollow") {
        value = {
          border_hover: colors.orchid,
          border: colors.bg,
          background: colors.bg,
        };
      }
      break;
    default:
      return;
  }
  return value[property];
};

const StyledButton = styled.button`
  outline: none;
  border: 1px solid ${getThemeColors("border")};
  background: ${getThemeColors("background")};
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
  color: ${getThemeColors("color")};
  &:hover {
    border-color: ${getThemeColors("border_hover")};
    background: ${getThemeColors("background_hover")};
    color: ${getThemeColors("color_hover")};
  }
`;

const Button = ({
  children,
  theme = "default",
  type = "solid",
  className,
  style,
  onClick,
}) => {
  return (
    <StyledButton
      theme={theme}
      type={type}
      className={className}
      style={{ ...(style || {}) }}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
