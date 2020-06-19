import React from "react";
import styled from "@emotion/styled";
import Image, { Shimmer } from 'react-shimmer'
import Description from "./description";
import { LinkCss } from "../style/ui";


function Result ({ innerRef, title, description, screenshot, source, url, type, emojis }) {

  return (
    <Container ref={innerRef}>
      <PreviewWrapper href={url}>
        <Image
          src={screenshot}
          fallback={<Shimmer width={300} height={230}/>}
          NativeImgProps={{
            style: {
              objectFit: "cover",
              maxWidth: "100%",
            }
          }}
        />
      </PreviewWrapper>
      <TextWrapper>
        <Title>{title}</Title>
        <Description
          text={description || 'No description.'}
          emojis={emojis}
        />
        <SourceWrapper>
          <img src={source.image_url} alt={source.uid}/>
          <a href={`https://github.com/${source.uid.replace('.', '/')}`}>{source.title}</a>
        </SourceWrapper>
      </TextWrapper>
    </Container>
  )
}

const Container = styled.div`
  width: 300px;
  min-height: 400px;
  margin-bottom: 50px;
`;

const PreviewWrapper = styled.a`
  width: 300px;
  height: 231px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  display: block;
  box-shadow: rgba(46, 41, 51, 0.08) 0px 1px 2px, rgba(71, 63, 79, 0.08) 0px 2px 4px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
  &:hover {
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
  a {
    margin-left: 4px;
    padding: 5px;
    ${p => LinkCss(
      'transparent',
      p.theme.color.red,
      p.theme.color.red,
      p.theme.color.white
    )};
  }
`;

const Title = styled.strong`
  color: ${p => p.theme.color.dark};
`;

export default Result;
