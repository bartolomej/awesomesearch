import React from 'react';
import styled from "styled-components";
import Tag from "./Tag";
import { LIGHTEST, PRIMARY } from "../colors";


export default function ResultItem ({ styles, type, topics, title, description, tags, url, image }) {
  const maxDescriptionLength = 70;

  return (
    <Container styles={styles} href={url} target="_blank">
      <LeftWrapper>
        <ImageWrapper>
          <Image src={image}/>
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
        {type === 'link'
          ? tags.slice(0, window.isMobile() ? 2 : 6).map(t => <Tag key={t} text={t}/>)
          : topics.slice(0, window.isMobile() ? 2 : 6).map(t => <Tag key={t} text={t}/>)
        }
      </RightWrapper>
    </Container>
  )
}

const Container = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  width: 80%;
  outline: none;
  text-decoration: none;
  transition: all 0.2s ease-out;
  &:hover {
    background: ${LIGHTEST};
    transform: scale(1.01);
  }
  @media (max-width: 500px) {
    flex-direction: column;
    margin: 20px 0;
  }
  ${props => props.styles}
`;

const LeftWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }
`;

const RightWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
  flex-wrap: wrap;
  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: bold;
  color: ${PRIMARY};
`;

const Description = styled.span`
  font-size: 14px;
  font-weight: lighter;
  color: grey;
`;

const ImageWrapper = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
  @media (max-width: 500px) {
    margin-bottom: 10px;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 500px) {
    margin: 0;
  }
`;

const Image = styled.img`
  height: 60px;
  border-radius: 8px;
`;
