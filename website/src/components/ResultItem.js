import React from 'react';
import styled from "styled-components";


export default function ResultItem ({ title, description }) {

  return (
    <Container>
      <h3>{title}</h3>
      <span>{description}</span>
    </Container>
  )
}

const Container = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  outline: none;
  border: none;
  background: white;
  cursor: pointer;
  &:hover {
    background: lightgrey;
  }
`;
