import React from "react";
import styled from "styled-components";


export default function ({ image, title, repoId, repoUrl, url }) {

  return (
    <Container>
      <ImageWrapper>
        <Image alt={title} src={image} />
      </ImageWrapper>
      <TextWrapper>
        <Title target="_blank" href={url}>{title.substring(0, 55)}...</Title>
        <RepoLink target="_blank" href={repoUrl}>{repoId}</RepoLink>
      </TextWrapper>
    </Container>
  )
}

const Container = styled.div` 
  margin-bottom: 30px;
  padding: 15px;
  width: 300px;
  display: flex;
  flex-direction: row;
  border-radius: 22px;
  transition: 0.5s all ease;
  background: #F5F7FB;
  box-shadow:  7px 7px 14px #d0d2d5, 
             -7px -7px 14px #ffffff;
  &:hover {
    background: white;
    transform: scale(1.02);
    box-shadow:  12px 12px 17px #d0d2d5, 
             -7px -7px 14px #ffffff;
  }
`;

const TextWrapper = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 4;
  text-align: left;
`;

const ImageWrapper = styled.div`
  height: 60px;
  width: 60px;
  overflow: hidden;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Image = styled.img`
  height: 100%;
`;

const Title = styled.a`
  font-size: 0.9em;
  font-weight: bolder;
  color: ${props => props.theme.primary};
  margin-bottom: 3px;
  line-height: 1.1;
  &:hover {
    color: ${props => props.theme.vibrant};
  }
`;

const RepoLink = styled.a`
  color: ${props => props.theme.secondary};
  font-size: 0.7em;
  &:hover {
    color: ${props => props.theme.vibrant};
  }
`;
