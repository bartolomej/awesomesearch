import React from 'react';
import styled from "styled-components";
import { TEXT_LIGHT, PRIMARY, SECONDARY, LIGHTEST } from "../colors";

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
  background: ${TEXT_LIGHT};
  min-width: 60px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  display: flex;
  margin: 0 .5em .5em 0;
  padding: .3em .9em;
  border-radius: 3px;
  color: ${SECONDARY};
  font-size: 11px;
  background: ${LIGHTEST};
`;

const Text = styled.span`
  color: ${PRIMARY};
  font-size: 12px;
`;
