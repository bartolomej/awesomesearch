import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from 'react-router-dom';
import ResultItem from "../components/ResultItem";
import { getLinks, getList } from "../api";
import { useInView } from "react-intersection-observer";


export default function List () {
  const { uid } = useParams();
  const [list, setList] = useState(null);
  const [links, setLinks] = useState(null);
  const [linkPage, setLinkPage] = useState(0);
  const [ref, inView, entry] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView === true) {
      getLinks(uid, linkPage + 1).then(res => setLinks([...links, ...res])).catch(console.error);
      setLinkPage(linkPage + 1);
    }
  }, [inView]);


  useEffect(() => {
    getList(uid).then(setList).catch(console.error);
    getLinks(uid).then(setLinks).catch(console.error);
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
      <ResultsContainer>
        {links && links.map((r, i) => (
          <ResultItem
            key={i}
            type={r.object_type}
            screenshot={r.screenshot_url}
            innerRef={i === links.length - 5 ? ref : null}
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
      </ResultsContainer>
    </Container>
  )
}

const Container = styled.div`
  background: ${props => props.theme.background};
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px 0;
  background: ${props => props.theme.background};
  box-shadow: 0 0 15px 40px ${props => props.theme.background};
`;

const ResultsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  ${props => props.custom};
  overflow-y: scroll;
  justify-content: center;
  width: 70%;
  margin: 0 auto;
  @media (max-width: 1300px) {
    width: 100%;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: 2em;
  margin-bottom: 10px;
  color: ${props => props.theme.secondary};
`;

const Description = styled.p`
  font-size: 1em;
  margin: 10px 0;
  text-align: center;
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
