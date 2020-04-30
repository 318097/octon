import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import colors from "../../magicdust/colors";

const Wrapper = styled.input`
  background: none;
  display: inline-block;
  padding: 10px;
  border-radius: 2px;
  border: 1px solid ${colors.bg};
  transition: 0.3s;
  outline: none;
  &:active,
  &:focus {
    border-color: ${colors.blue};
  }
`;

const Input = ({
  style = {},
  className = "input",
  curved = true,
  autoFocus = true,
  placeholder = "",
  onChange,
  onBlur,
}) => {
  const classes = classNames({
    "curve-border": curved,
  });

  const handleChange = () => {
    if (onChange) onChange();
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  return (
    <Wrapper
      autoFocus={autoFocus}
      placeholder={placeholder}
      style={{ ...style }}
      className={`${classes} ${className}`}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default Input;
