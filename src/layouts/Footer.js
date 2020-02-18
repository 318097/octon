import React from "react";
import styled from "styled-components";

import Facebook from "../assets/icons/facebook.png";
import Instagram from "../assets/icons/instagram.png";
import Twitter from "../assets/icons/twitter.png";

const Wrapper = styled.div`
  position: absolute;
  bottom: 4px;
  right: 0px;
  display: flex;
  padding-right: 3px;
  @media screen and (max-width: 400px) {
    position: relative;
    left: 4px;
  }
  a {
    margin: 1px;
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
      <img src={Facebook} alt="facebook" />
    </a>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://www.instagram.com/brainbox.in/"
    >
      <img src={Instagram} alt="instagram" />
    </a>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href="https://twitter.com/brainboxin"
    >
      <img src={Twitter} alt="twitter" />
    </a>
  </Wrapper>
);

export default Footer;
