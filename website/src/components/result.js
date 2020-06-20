import React from "react";
import styled from "@emotion/styled";
import Image, { Shimmer } from 'react-shimmer'
import Description from "./description";
import { Link1 } from "../style/ui";


function Result ({ innerRef, title, description, screenshot, source, url, type, emojis, onSourceClick }) {

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
        {source && (
          <SourceWrapper>
            <a href={`https://github.com/${source.uid.split('.')[0]}`}>
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
  min-height: 400px;
  margin: 0 20px 50px 20px;
  @media (max-width: 700px) {
    margin: 0 0 50px 0;
  }
`;

const PreviewWrapper = styled.a`
  width: 300px;
  height: 231px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
  display: flex;
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
  a:first-child {
    transition: 0.2s all ease-in-out;
  }
  a:first-child:hover {
    transform: scale(1.1);
  }
  button {
    margin-left: 4px;
    padding: 3px;
    ${p => Link1(
      p.theme.color.red,
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
