import styled from "styled-components";
import UseAnimations from "react-useanimations";
import React from "react";


export function GithubLink ({ href }) {
  return (
    <GitHubLinkContainer href={href} target="_blank">
      <GitHubLogo animationKey="github" size={50} />
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
  top: 20px;
  right: 20px;
  color: ${props => props.theme.primary};
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

export const MessageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const MessageText = styled.span`
  font-size: 18px;
  margin-top: 10px;
  color: ${props => props.theme.lightText};
`;
