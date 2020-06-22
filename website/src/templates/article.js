import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import styled from "@emotion/styled";


export default function BlogPost ({ data }) {
  const post = data.markdownRemark

  return (
    <Layout>
      <Header>
        <Title>{post.frontmatter.title}</Title>
      </Header>
      <Container>
        <div dangerouslySetInnerHTML={{ __html: post.html }}/>
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  width: 40%;
  margin: 0 auto;
  padding: 100px 0;
  
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
`

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
