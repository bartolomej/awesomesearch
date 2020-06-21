import React from "react";
import styled from "@emotion/styled";
import Image, { Shimmer } from 'react-shimmer'
import Description from "./description";
import { LinkCss } from "../style/ui";


function Result ({ uid, innerRef, title, description, screenshot, source, url, type, emojis, onSourceClick }) {

  const previewImage = (
    <ImageWrapper>
      <Image
        src={screenshot}
        fallback={<Shimmer width={300} height={230}/>}
        NativeImgProps={{
          style: {
            objectFit: "cover",
            width: "100%",
          }
        }}
      />
    </ImageWrapper>
  );

  return (
    <Container ref={innerRef}>
      {type === 'list' ? (
        <ButtonWrapper onClick={() => onSourceClick(uid)}>
          {previewImage}
          <Title>{title}</Title>
        </ButtonWrapper>
      ) : (
        <LinkWrapper target="_blank" href={url}>
          {previewImage}
          <Title>{title}</Title>
        </LinkWrapper>
      )}
      <TextWrapper>
        <Description
          text={description || 'No description.'}
          emojis={emojis}
        />
        {source && (
          <SourceWrapper>
            <a target="_blank" href={`https://github.com/${source.uid.split('.')[0]}`}>
              <img src={source.image_url} alt={'List author'}/>
            </a>
            <button onClick={() => onSourceClick(source.uid)}>{source.title}</button>
          </SourceWrapper>
        )}
      </TextWrapper>
    </Container>
  )
}

const Container = styled.div`
  width: 300px;
  max-height: 400px;
  margin: 0 20px 70px 20px;
  @media (max-width: 700px) {
    margin: 0 0 50px 0;
  }
`;

const Title = styled.strong`
  color: ${p => p.theme.color.dark};
  line-height: 1.5;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
`;

const ImageWrapper = styled.div`
  width: 300px;
  height: 231px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  box-shadow: rgba(46, 41, 51, 0.08) 0px 1px 2px, rgba(71, 63, 79, 0.08) 0px 2px 4px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
`

const ButtonWrapper = styled.button`
  strong {
    font-size: ${p => p.theme.size(1.1)};
  }
  &:hover ${Title} {
    color: ${p => p.theme.color.red};
    box-shadow: 0 1px ${p => p.theme.color.red};
  }
  &:hover ${ImageWrapper} {
    transform: translateY(-0.25rem);
    box-shadow: rgba(46, 41, 51, 0.08) 0px 4px 8px, rgba(71, 63, 79, 0.16) 0px 8px 16px;
  }
`;

const LinkWrapper = styled.a`
  &:hover ${Title} {
    color: ${p => p.theme.color.red};
    box-shadow: 0 1px ${p => p.theme.color.red};
  }
  &:hover ${ImageWrapper} {
    transform: translateY(-0.25rem);
    box-shadow: rgba(46, 41, 51, 0.08) 0px 4px 8px, rgba(71, 63, 79, 0.16) 0px 8px 16px;
  }
`;

const TextWrapper = styled.div``;

const SourceWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  a:first-of-type {
    transition: 0.2s all ease-in-out;
  }
  a:first-of-type:hover {
    transform: scale(1.1);
  }
  button {
    margin-left: 4px;
    padding: 3px;
    font-size: ${p => p.theme.size(0.9)};
    ${p => LinkCss(
  'transparent',
  p.theme.color.red,
  p.theme.color.red,
  p.theme.color.white
)};
  }
`;

export default Result;
