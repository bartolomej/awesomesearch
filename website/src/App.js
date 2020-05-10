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
import Search from "./search";


const search = new Search();

export default function App () {
  const [error, setError] = useState(null);
  const [result, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function getResults () {
    return result.result ? result.result : [];
  }

  async function fetchResults (query) {
    try {
      setLoading(true);
      const results = await search.run(query);
      if (results !== null) {
        setResults(results);
      }
    } catch (e) {
      setError(e);
      console.log(e);
    }
    setLoading(false);
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
            results={getResults().length}
            placeholder={"Enter search term..."}
            onChange={query => fetchResults(query)}
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
        {(!loading && !error && getResults().length === 0) && (
          <MessageWrapper>
            <UnicornLogo/>
            <MessageText>Wow such empty!</MessageText>
            <MessageText>Search the largest collection of awesome resources.</MessageText>
          </MessageWrapper>
        )}
        {!loading && getResults().map((r, i) => (
          <ResultItem
            key={i}
            type={r.object_type}
            url={r.url}
            image={r.image}
            title={r.title}
            tags={r.tags}
            topics={r.topics}
            description={r.description}
            styles={i === 0 ? 'margin-top: 50px !important;' : ''}
          />
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgb(255,255,255);
  background: linear-gradient(180deg, rgba(255,255,255,1) 40%, rgba(252,96,168,0.25) 100%);
`;

const Header = styled.header`
  height: 30%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  box-shadow: 0 0 20px 40px #FFFF;
  z-index: 10;
`;

const Body = styled.div`
  height: 70%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 10px;
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
    width: 40%;
  }
  @media (max-width: 1000px) {
    width: 70%;
  }
  @media (max-width: 600px) {
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
  transition: all 1s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;


/** SVG GRAPHICS **/

// https://codesandbox.io/s/v303jqkyk7?from-embed
const AwesomeLogo = styled(awesomeIcon)`
  height: 6rem;
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
