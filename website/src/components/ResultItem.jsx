import React from 'react';
import styled from "styled-components";
import Tag from "./Tag";


export default function ResultItem ({ innerRef, styles, type, title, description, tags, url, image }) {
  const maxDescriptionLength = 70;

  return (
    <Container ref={innerRef} styles={styles} href={url} target="_blank">
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
        {tags.slice(0, window.isMobile() ? 2 : 6).map(t => <Tag key={t} text={t}/>)}
      </RightWrapper>
    </Container>
  )
}

const Container = styled.a`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 13px;
  margin-top: 20px;
  width: 70%;
  outline: none;
  text-decoration: none;
  transition: all 0.1s ease-out;
  border-radius: 22px;
  &:hover {
    transform: scale(1.01);
    box-shadow:  7px 7px 14px #d0d2d5, 
             -7px -7px 14px #ffffff;
  }
  @media (max-width: 500px) {
    flex-direction: column;
    margin: 0;
    width: 90%;
    padding: 10px;
  }
  ${props => props.styles}
`;

const LeftWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  @media (max-width: 500px) {
    flex-direction: row;
    align-items: center;
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
  color: ${props => props.theme.primary};
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
    flex: 1;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  @media (max-width: 500px) {
    margin: 0;
    flex: 4;
  }
`;

const Image = styled.img`
  width: 60px;
  border-radius: 8px;
  @media (max-width: 500px) {
    margin-right: 5px;
  }
`;
