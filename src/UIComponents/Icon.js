import React from "react";
import { Icon as AntIcon } from "antd";
import styled from "styled-components";
import colors from "../colors";

const StyledIcon = styled(AntIcon)`
  padding: 4px;
  background: ${colors.strokeOne};
  transition: 0.8s;
  margin: 2px;
  border-radius: 50%;
  &:hover {
    background: ${colors.shade2};
  }
`;

const Icon = ({ className, onClick, type }) => (
  <StyledIcon className={className} onClick={onClick} type={type} />
);

export default Icon;
