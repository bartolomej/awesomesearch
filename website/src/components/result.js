import React from "react";
import styled from "@emotion/styled/macro";
import Image, { Shimmer } from 'react-shimmer'
import Description from "./description";
import { LinkCss } from "../style/ui";


function Result ({
  uid,
  innerRef,
  title,
  description,
  screenshot,
  source,
  url,
  type,
  emojis,
  onSourceClick,
  displayOnHover
}) {

  const previewImage = (
    <ImageWrapper>
      {displayOnHover && (
        <OnHoverWrapper>
          {displayOnHover}
        </OnHoverWrapper>
      )}
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
      <PreviewWrapper>
        {type === 'list' ? (
          <ButtonWrapper onClick={() => onSourceClick(uid)}>
            {previewImage}
            <Title>{title}</Title>
          </ButtonWrapper>
        ) : (
          <LinkWrapper target="_blank" rel="noopener" href={url}>
            {previewImage}
            <Title>{title}</Title>
          </LinkWrapper>
        )}
      </PreviewWrapper>
      <TextWrapper>
        <Description
          text={description || 'No description.'}
          emojis={emojis}
        />
        {source && (
          <SourceWrapper>
            <a target="_blank" rel="noopener"
               href={`https://github.com/${source.uid.split('.')[0]}`}>
              <img src={source.image_url} alt={'List author'}/>
            </a>
            <button
              onClick={() => onSourceClick(source.uid)}>{source.title}</button>
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
  animation: ease-in 200ms resAppear forwards;
  @media (max-width: 700px) {
    margin: 0 0 50px 0;
  }
  @keyframes resAppear {
    0% {
      opacity: 0;
      transform: translateY(5%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.strong`
  color: ${p => p.theme.color.dark};
  line-height: 1.5;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
`;

const ImageWrapper = styled.div`
  width: 300px;
  position: relative;
  height: 231px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
  box-shadow: rgba(46, 41, 51, 0.08) 0px 1px 2px, rgba(71, 63, 79, 0.08) 0px 2px 4px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
`
const OnHoverWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  top: 40%;
  left: 0;
  right: 0;
  z-index: 3;
  opacity: 0;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)
`;

const PreviewWrapper = styled.div`
  &:hover ${Title} {
    color: ${p => p.theme.color.red};
    box-shadow: 0 1px ${p => p.theme.color.red};
  }
  &:hover ${ImageWrapper} {
    transform: translateY(-0.25rem);
    box-shadow: rgba(46, 41, 51, 0.08) 0px 4px 8px, rgba(71, 63, 79, 0.16) 0px 8px 16px;
  }
  &:hover ${OnHoverWrapper} {
    opacity: 1;
  }
`;

const ButtonWrapper = styled.button`
  strong {
    font-size: ${p => p.theme.size(1.1)};
  }
`;

const LinkWrapper = styled.a``;

const TextWrapper = styled.div``;

const SourceWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-weight: bold;
  img {
    width: 25px;
    height: 25px;
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
