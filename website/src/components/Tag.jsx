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
  background: ${props => props.theme.light};
  min-width: 60px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 0 .5em .5em 0;
  padding: .3em .9em;
  border-radius: 3px;
  font-size: 11px;
`;

const Text = styled.span`
  color: ${props => props.theme.secondary};
  font-size: 12px;
`;
