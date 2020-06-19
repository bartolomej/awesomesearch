import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import styled from "@emotion/styled";


export default function BlogPost ({ data }) {
  const post = data.markdownRemark

  return (
    <Layout>
      <Container>
        <Title>{post.frontmatter.title}</Title>
        <div dangerouslySetInnerHTML={{ __html: post.html }}/>
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  width: 60%;
  margin: 0 auto;
  padding: 100px 0;
  
  p {
    color: ${p => p.theme.color.dark};
    margin: 20px 0;
  }
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
                title
            }
        }
    }
`
