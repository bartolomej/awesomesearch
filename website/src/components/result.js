import React from "react";
import styled from "@emotion/styled";
import Image, { Shimmer } from 'react-shimmer'


function Result ({ title, description, screenshot, source, url, type }) {

  return (
    <Container>
      <PreviewWrapper>
        <Image
          src={screenshot}
          fallback={<Shimmer width={300} height={230} />}
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
        <Description>{description}</Description>
      </TextWrapper>
    </Container>
  )
}

const Container = styled.div`
  width: 300px;
  height: 400px;
`;

const PreviewWrapper = styled.div`
  width: 300px;
  height: 231px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const TextWrapper = styled.div`
  
`;

const Title = styled.strong`
  color: ${p => p.theme.color.dark};
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: ${p => p.theme.opacity(p.theme.color.dark, 100)};
`;

export default Result;
