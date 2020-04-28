import React from "react";
import styled from "styled-components";
import classNames from "classnames";
import colors from "../../madDesign/colors";

const Wrapper = styled.div`
  background: ${colors.white};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 2px;
  border: 1px solid ${colors.bg};
  font-size: 1.2rem;
  transition: 0.3s;
  position: relative;
  cursor: pointer;
  &:hover {
    background: ${colors.bg};
    /* border-color: ${colors.blue}; */
  }
`;

const Tag = ({ children, style, className = "tag", onClick }) => {
  const classes = classNames({});

  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <Wrapper className={`${classes} ${className}`} onClick={handleClick}>
      {children}
    </Wrapper>
  );
};

export default Tag;
