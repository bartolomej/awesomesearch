import React from "react";
import styled from "styled-components";
import { ReactComponent as logo } from "../assets/logo.svg";
import UseAnimations from "react-useanimations";
import { Link } from "react-router-dom";
import RandomItem from "../components/RandomItem";


const randomPics = [
  {
    object_type: "link",
    url: "http://rog.ie",
    title: "Rogie King — Multidisciplinary Artist, Designer and Programmer",
    type: "website",
    name: null,
    author: "Rogie King",
    description: "Rogie King — Rogie is a Multidisciplinary Artist, Designer and Programmer that loves design and art with a touch of whimsy and good vibes.",
    image: "https://rog.ie/assets/rog.ie-og-card.jpg",
    keywords: null,
    source: "amnashanwar/awesome-portfolios",
    updated: null,
    tags: [ ]
  },
  {
    object_type: "link",
    url: "http://jeanhelfenstein.com",
    title: "Jean Helfenstein | Creative Developer | Los Angeles",
    type: null,
    name: "Jean Helfenstein | Creative Developer | Los Angeles",
    author: null,
    description: "Jean Helfenstein's Portfolio. French Creative Developer based in Los Angeles, California",
    image: "http://jeanhelfenstein.com/share.jpg",
    keywords: null,
    source: "amnashanwar/awesome-portfolios",
    updated: null,
    tags: [ ]
  },
  {
    object_type: "link",
    url: "http://artist-developer.com",
    title: "Artist-Developer",
    type: null,
    name: null,
    author: null,
    description: null,
    image: null,
    keywords: null,
    source: "amnashanwar/awesome-portfolios",
    updated: null,
    tags: [ ]
  },
  {
    object_type: "link",
    url: "https://daneden.me",
    title: "Daniel Eden, Designer",
    type: null,
    name: null,
    author: null,
    description: "The personal site, blog, and portfolio of Daniel Eden, a designer who cares about the web and design systems",
    image: "https://daneden.me/images/og.png",
    keywords: null,
    source: "amnashanwar/awesome-portfolios",
    updated: null,
    tags: [ ]
  },
  {
    object_type: "link",
    url: "http://corentinfardeau.fr",
    title: "Corentin Fardeau - Freelance Creative Developer - Paris",
    type: "website",
    name: "Corentin Fardeau Portfolio",
    author: null,
    description: "My name is Corentin Fardeau, I’m a french creative developer based in Los Angeles currently interning at watson/DG. I’m a fifth year student at HETIC in Paris. I'm available for freelance now.",
    image: "http://corentinfardeau.fr/assets/images/pixi/about.jpg",
    keywords: null,
    source: "amnashanwar/awesome-portfolios",
    updated: null,
    tags: [ ]
  },
  {
    object_type: "link",
    url: "http://lucasmartin.fr",
    title: "Lucas Martin - Freelance interactive developer",
    type: "website",
    name: "Lucas Martin - Freelance interactive developer",
    author: "Lucas Martin",
    description: "I'm a freelance interactive developer focusing on merging design with programming to create interactive digital experiences. Contact: contact@lucasmartin.fr",
    image: "http://lucasmartin.fr/share.png",
    keywords: null,
    source: "amnashanwar/awesome-portfolios",
    updated: null,
    tags: [
      "developer",
      "front-end",
      "freelance",
      "interactive",
      "website",
      "lucas",
      "martin",
      "offf",
      "hetic",
      "aqka",
      "wild"
    ]
  },
];

export default function Home () {

  return (
    <Container>
      <TopWrapper>
        <AwesomeSearchLogo/>
        <Description>
          Search engine for discovering more relevant awesome stuff from <a href="https://awesome.re/">Awesome Lists.</a>
        </Description>
        <SearchLink to="/search">
          Go to Search
          <UseAnimations
            animationKey="arrowDown"
            size={30}
            style={{ transform: 'rotate(-90deg)', padding: 10 }}
          />
        </SearchLink>
      </TopWrapper>
      <BottomWrapper>
        <SectionTitle>Random Pics</SectionTitle>
        <PickedItemsWrapper>
          {randomPics.map(item => (
            <RandomItem
              url={item.url}
              image={item.image}
              title={item.title}
              repoId={item.source}
              repoUrl={`https://github.com/${item.source}`}
            />
          ))}
        </PickedItemsWrapper>
      </BottomWrapper>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.background};
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const BottomWrapper = styled.div`
  width: 100%;
  flex: 2;
  text-align: center;
  @media (max-width: 700px) {
    width: 90%;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5em;
  color: ${props => props.theme.primary};
  font-weight: bold;
  margin: 40px;
`;

const PickedItemsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const Description = styled.p`
  color: ${props => props.theme.lightText};
  font-size: 1.2em;
  text-align: center;
  max-width: 500px;
  margin-top: 30px;
  margin-bottom: 50px;
  a {
    color: ${props => props.theme.secondary};
  }
`;

const SearchLink = styled(Link)`
  color: ${props => props.theme.secondary};
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.2em;
  font-weight: bold;
`;

const AwesomeSearchLogo = styled(logo)`
  width: 400px;
  height: 100%;
  @media (max-width: 700px) {
    width: 200px;
  }
`;
