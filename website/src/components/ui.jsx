import styled from "styled-components";
import UseAnimations from "react-useanimations";
import React from "react";


export function GithubLink ({ href }) {
  return (
    <GitHubLinkContainer href={href} target="_blank">
      <GitHubLogo/>
    </GitHubLinkContainer>
  )
}

const GitHubLogo = styled(UseAnimations)`
  height: 2rem;
  width: 2rem;
  display: inline-block;
  margin: 0 auto;
  fill: ${props => props.theme.primary};
`;

const GitHubLinkContainer = styled.a`
  z-index: 20;
  opacity: 0.5;
  transition: all ease-in-out 0.3s;
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;
