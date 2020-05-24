import React from 'react';
import styled from "styled-components";


export default function ResultItem ({ innerRef, styles, type, title, description, tags, url, image, screenshot }) {
  const maxDescriptionLength = 70;
  const maxTitleLength = 50;

  return (
    <Container ref={innerRef}>
      <PreviewContainer>
        <Image src={screenshot || image} alt={title}/>
      </PreviewContainer>
      <DescriptionContainer>
        <Title>{cropText(title, maxTitleLength)}</Title>
        <Description>{cropText(description, maxDescriptionLength)}</Description>
      </DescriptionContainer>
    </Container>
  )
}

function cropText (text, maxSize) {
  return text &&
    text.substring(0, maxSize) +
    `${text.length > maxSize ? '...' : ''}`
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 400px;
  background: ${props => props.theme.white};
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
`;

const PreviewContainer = styled.div`
  overflow: hidden;
  height: 70%;
  display: flex;
  justify-content: center;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 30%;
`;

const Image = styled.img`
  height: 100%;
`

const Title = styled.h3`
  color: ${props => props.theme.primary};
  margin-bottom: 5px;
`;

const Description = styled.p`
  color: ${props => props.theme.primary};
`;
