import React, { useEffect, useState } from 'react';
import styled from "styled-components";


export default function ResultItem ({ innerRef, sourceUid, styles, type, title, description, tags, url, image, screenshot }) {
  const [source, setSource] = useState(null);
  const maxDescriptionLength = 70;
  const maxTitleLength = 50;

  // TODO: remove call and instead embed info in search response
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/list/${sourceUid}`)
      .then(res => res.json())
      .then(setSource)
      .catch(console.error);
  }, []);

  return (
    <Container ref={innerRef}>
      <PreviewContainer target="_blank" href={url}>
        <Image src={screenshot || image} alt={title}/>
      </PreviewContainer>
      <DescriptionContainer>
        <Title>{cropText(title, maxTitleLength)}</Title>
        <Description>{cropText(description, maxDescriptionLength)}</Description>
        {source && (
          <SourceWrapper>
            <SourceImage src={source.image_url} alt={source.title} />
            <SourceLink target="_blank" href={source.url}>{source.title}</SourceLink>
          </SourceWrapper>
        )}
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

const PreviewContainer = styled.a`
  overflow: hidden;
  height: 70%;
  display: flex;
  justify-content: center;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 30%;
  margin-top: 8px;
  border-radius: 5px;
`;

const Image = styled.img`
  height: 100%;
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`

const Title = styled.h3`
  color: ${props => props.theme.primary};
  font-size: 0.9em;
`;

const Description = styled.p`
  color: ${props => props.theme.primary};
  font-size: 0.8em;
`;

const SourceWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SourceImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`

const SourceLink = styled.a`
  color: ${props => props.theme.secondary};
  font-weight: bold;
  font-size: 0.7em;
  margin-left: 8px;
`;
