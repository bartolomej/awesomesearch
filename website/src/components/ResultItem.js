import React from 'react';
import styled from "styled-components";
import Tag from "./Tag";


export default function ResultItem ({ type, title, description, tags, url, image }) {
  const maxDescriptionLength = 70;

  return (
    <Container href={url} target="_blank">
      <LeftWrapper>
        <ImageWrapper>
          <Image src={image} />
        </ImageWrapper>
        <TextWrapper>
          <Title>{title}</Title>
          <Description>
            {
              description &&
              description.substring(0, maxDescriptionLength) +
              `${description.length > maxDescriptionLength ? '...' : ''}`
            }
          </Description>
        </TextWrapper>
      </LeftWrapper>
      <RightWrapper>
        {tags.map(t => <Tag text={t} />)}
      </RightWrapper>
    </Container>
  )
}

const Container = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 0;
  width: 90%;
  outline: none;
  background: white;
  text-decoration: none;
  &:hover {
    background: lightgrey;
  }
  ${props => props.styles}
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Title = styled.span`
  font-size: 15px;
  font-weight: bold;
  color: black;
`;

const Description = styled.span`
  font-size: 11px;
  font-weight: lighter;
  color: grey;
`;

const ImageWrapper = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  height: 40px;
  border-radius: 8px;
`;
