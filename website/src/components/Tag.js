import React from 'react';
import styled from "styled-components";

export default function ({text, backgroundColor, textColor}) {

  return (
    <Container backgroundColor={backgroundColor}>
      <Text textColor={textColor}>
        {text}
      </Text>
    </Container>
  )
}

const Container = styled.div`
  background: lightblue;
  border-radius: 5px;
  padding: 5px;
  min-width: 60px;
  height: fit-content;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const Text = styled.span`
  color: black;
  font-size: 12px;
`;
