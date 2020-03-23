import React, { useState } from 'react';
import styled from 'styled-components';
import SearchBar from "./components/SearchBar";
import ResultItem from "./components/ResultItem";
import { ReactComponent as awesomeIcon } from "./assets/logo.svg";
import { ReactComponent as githubIcon } from "./assets/github.svg";
import { ReactComponent as unicornIcon } from "./assets/unicorn.svg";
import { ReactComponent as errorIcon } from "./assets/cancel.svg";
import { PRIMARY, SECONDARY, TEXT_LIGHT } from "./colors";
import Loader from "react-spinners/BeatLoader";



export default function App () {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  async function fetchResults (searchTerm) {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${process.env.REACT_APP_API_HOST}/search?q=${searchTerm}`);
      const results = await response.json();
      setResults(results);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <Container>
      <GitHubLink target="_blank" href="https://github.com/bartolomej/awesome-api">
        <GitHubLogo/>
      </GitHubLink>
      <Header>
        <HeaderWrapper>
          <AwesomeLink target="_blank" href="https://github.com/sindresorhus/awesome#readme">
            <AwesomeLogo/>
          </AwesomeLink>
          <Title>Awesome Search</Title>
          <SearchBar
            placeholder={"Enter search term..."}
            onChange={fetchResults}
          />
        </HeaderWrapper>
      </Header>
      <Body>
        {loading && (
          <MessageWrapper>
            {/* https://www.davidhu.io/react-spinners/ */}
            <Loader
              size={30}
              color={SECONDARY}
              loading={loading}
            />
          </MessageWrapper>
        )}
        {error && (
          <MessageWrapper>
            <ErrorLogo/>
            <MessageText>{error.message}</MessageText>
          </MessageWrapper>
        )}
        {(!loading && !error && results.length === 0) && (
          <MessageWrapper>
            <UnicornLogo/>
            <MessageText>Wow such empty!</MessageText>
            <MessageText>Search the largest collection of awesome resources.</MessageText>
          </MessageWrapper>
        )}
        {!loading && results.map((r, i) => (
          <ResultItem
            key={i}
            type={r.type}
            url={r.url}
            image={r.image}
            title={r.title}
            tags={r.tags}
            description={r.description}
          />
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(255,255,255,1) 20%, rgba(252,96,168,0.25) 100%);
`;

const Header = styled.header`
  height: 30vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 10px;
  height: 70vh;
  width: 100vw;
  position: fixed;
  bottom: 0;
  overflow-y: scroll;
`;

const HeaderWrapper = styled.div`
  width: 30%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  @media (max-width: 1400px) {
    width: 50%;
  }
  @media (max-width: 800px) {
    width: 80%;
  }
  @media (max-width: 500px) {
    width: 90%;
  }
`;

const MessageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const MessageText = styled.span`
  font-size: 18px;
  margin-top: 10px;
  color: ${TEXT_LIGHT};
`;

const Title = styled.h1`
  color: ${PRIMARY};
  font-size: 40px;
  @media (max-width: 500px) {
    font-size: 25px;
  }
`;


/** LINKS **/

const GitHubLink = styled.a`
  z-index: 10;
  opacity: 0.5;
  transition: all ease-in-out 0.3s;
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const AwesomeLink = styled.a`
  animation: wiggle 1s infinite;
  animation-play-state: paused; 
  &:hover {
    animation-play-state: running;
  }
  @keyframes wiggle {
    0% { transform: rotate(0deg); }
   50% { transform: rotate(0deg); }
   55% { transform: rotate(5deg) scale(1.1) }
   65% { transform: rotate(-5deg) scale(1.2); }
  70% { transform: rotate(0deg); }
}
`;


/** SVG GRAPHICS **/

// https://codesandbox.io/s/v303jqkyk7?from-embed
const AwesomeLogo = styled(awesomeIcon)`
  height: 5rem;
  display: inline-block;
  margin: 0 auto;
  stroke: ${PRIMARY};
  stroke-width: 15px;
`;

const GitHubLogo = styled(githubIcon)`
  height: 2rem;
  width: 2rem;
  display: inline-block;
  margin: 0 auto;
  fill: ${PRIMARY};
`;

const UnicornLogo = styled(unicornIcon)`
  height: 10rem;
  width: 10rem;
  display: inline-block;
  opacity: 0.7;
  margin: 0 auto 20px;
  @media (max-width: 500px) {
    height: 6rem;
    width: 6rem;
  }
`;

const ErrorLogo = styled(errorIcon)`
  height: 10rem;
  width: 10rem;
  display: inline-block;
  opacity: 0.7;
  margin: 0 auto 20px;
`;
