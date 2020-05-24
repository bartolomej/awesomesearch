import React from "react";
import styled from "styled-components";
import { ReactComponent as icon } from "../assets/icon.svg";
import { Link } from "react-router-dom";


export default function HeaderBar ({ children }) {

  return (
    <Container>
      <LeftSide>
        <Icon/>
      </LeftSide>
      {children && (
        <Middle>
          {children}
        </Middle>
      )}
      <RightSide>
        <LinkItem to="/">Home</LinkItem>
        <LinkItem to="/search">Search</LinkItem>
      </RightSide>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  height: 7vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
  background: ${props => props.theme.headerBar};
  border-bottom: 1px solid #E6EAEA;
  @media (max-width: 500px) {
    height: 10vh;
  }
`;

const LeftSide = styled.div`
  flex: 1;
  @media (max-width: 500px) {
    display: none;
  }
`;

const Middle = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  @media (max-width: 500px) {
    display: none;
  }
`;

const Icon = styled(icon)`
  width: 40px;
  height: 40px;
`;

const LinkItem = styled(Link)`
  font-size: 1em;
  margin-left: 20px;
  color: ${props => props.theme.primary};
`;
