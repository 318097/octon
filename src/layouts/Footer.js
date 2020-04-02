import React from "react";
import styled from "styled-components";

import Facebook from "../assets/icons/Facebook";
import Instagram from "../assets/icons/Instagram";
import Twitter from "../assets/icons/Twitter";

const Wrapper = styled.div`
  position: absolute;
  bottom: 4px;
  right: 0px;
  display: flex;
  padding-right: 3px;
  @media screen and (max-width: 400px) {
    display: none;
    position: relative;
    left: 4px;
  }
  a {
    margin: 0 2px;
    cursor: pointer;
    transition: 1s;
  }
`;

const Footer = () => (
  <Wrapper>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.facebook.com/brainbox.in/"
    >
      <Facebook />
    </a>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.instagram.com/brainbox.in/"
    >
      <Instagram />
    </a>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://twitter.com/brainboxin"
    >
      <Twitter />
    </a>
  </Wrapper>
);

export default Footer;
