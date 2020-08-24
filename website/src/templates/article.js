import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import styled from "@emotion/styled";
import Animation from "../components/animation";


export default function BlogPost ({ data }) {
  const post = data.markdownRemark

  return (
    <Layout>
      <AnimationWrapper>
        <Animation speed={0.02} color={'rgb(254,206,168)'}/>
      </AnimationWrapper>
      <Header>
        <Title>{post.frontmatter.title}</Title>
      </Header>
      <Body>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: post.html }}/>
        </Container>
      </Body>
    </Layout>
  )
}

const Body = styled.div`
  position: relative;
  min-height: 80vh;
  background: ${p => p.theme.color.light};
`;

const Container = styled.div`
  width: 40%;
  margin: 0 auto;
  padding: 100px 0;
  background: ${p => p.theme.color.light};
  color: ${p => p.theme.color.dark};
  
  p {
    color: ${p => p.theme.color.dark};
    margin: 20px 0;
    line-height: 1.8;
  }
  img {
    box-shadow: none !important;
  }
  @media (max-width: 700px) {
    width: 95%;
  }
`;

const Header = styled.header`
  background: ${p => p.theme.color.dark};
  min-height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AnimationWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 30vh;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: ${p => p.theme.color.red};
`;

export const query = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            html
            frontmatter {
                title,
                image {
                    relativePath
                }
            }
        }
    }
`
