import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from 'react-router-dom';
import ResultItem from "../components/ResultItem";
import { LinksContainer } from "../styles";


export default function List () {
  const { uid } = useParams();
  const [list, setList] = useState(null);
  const [links, setLinks] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/list/${uid}`)
      .then(res => res.json())
      .then(setList);
    fetch(`${process.env.REACT_APP_API_HOST}/list/${uid}/link`)
      .then(res => res.json())
      .then(setLinks);
  }, []);

  return (
    <Container>
      {list && (
        <Header>
          <Title>{list.title}</Title>
          <Description>{list.description}</Description>
          <ListImage src={list.image}/>
          <ListImage src={list.image}/>
          <WebsiteLink target="_blank" href={list.url}>
            Visit original
          </WebsiteLink>
        </Header>
      )}
      <LinksContainer top={'30vh'}>
        {links && links.map((r, i) => (
          <ResultItem
            key={i}
            type={r.object_type}
            screenshot={r.screenshot_url}
            url={r.url}
            image={r.image_url}
            sourceUrl={'http://api.awesomesearch.in/list/amnashanwar.awesome-portfolios'}
            sourceImage={'https://avatars3.githubusercontent.com/u/31182732?v=4'}
            title={r.title}
            tags={r.tags}
            topics={r.topics}
            description={r.description}
            styles={i === 0 ? 'margin-top: 50px !important;' : ''}
          />
        ))}
      </LinksContainer>
    </Container>
  )
}

const Container = styled.div`
  background: ${props => props.theme.background};
  height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 30vh;
  z-index: 3;
  box-shadow: 0 0 15px 40px ${props => props.theme.background};
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 10px;
  color: ${props => props.theme.secondary};
`;

const Description = styled.p`
  font-size: 1.2em;
  margin: 10px 0;
  color: ${props => props.theme.primary};
`;

const WebsiteLink = styled.a`
    padding: .8rem 1.5rem;
    border-radius: .3rem;
    font-size: .9rem;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-decoration: none;
    background-image: linear-gradient(-131deg, ${props => props.theme.secondary} 0%, ${props => props.theme.vibrant} 100%);
    color: #fff;
    letter-spacing: 0.02em;
    transition: all .3s ease-in-out;
`;

const ListImage = styled.img``;
