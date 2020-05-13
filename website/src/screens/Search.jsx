import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchBar from "../components/SearchBar";
import ResultItem from "../components/ResultItem";
import { ReactComponent as searchIcon } from "../assets/telescope.svg";
import { ReactComponent as errorIcon } from "../assets/cancel.svg";
import { ReactComponent as logo } from "../assets/logo.svg";
import SearchEngine from "../search";
import { GithubLink, MessageText, MessageWrapper } from "../components/ui";
import UseAnimations from "react-useanimations";
import { Link } from "react-router-dom";
import { theme } from "../colors";
import { useInView } from "react-intersection-observer";


const search = new SearchEngine();

export default function Search () {
  const [error, setError] = useState(null);
  const [result, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ref, inView, entry] = useInView({
    /* Optional options */
    threshold: 0,
  });

  useEffect(() => {
    if (inView === true) {
      if (search.isNextPage()) {
        search.nextPage().then(res => setResults([...result, ...res]));
      }
    }
  }, [inView]);

  function getResults () {
    return result || [];
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
      <GithubLink href={'https://github.com/bartolomej/awesome-search'}/>
      <Header>
        <HeaderWrapper>
          <AwesomeLink to="/">
            <AwesomeLogo/>
          </AwesomeLink>
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
            <UseAnimations
              animationKey="loading2"
              size={60}
              style={{ padding: 100, color: theme.primary }}
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
            <SearchIcon/>
            <MessageText>Wow such empty!</MessageText>
            <MessageText>Search the largest collection of awesome resources.</MessageText>
          </MessageWrapper>
        )}
        {!loading && getResults().map((r, i) => (
          <ResultItem
            key={i}
            innerRef={i === getResults().length - 5 ? ref : null}
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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Header = styled.header`
  height: 30vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  box-shadow: 0 0 15px 40px ${props => props.theme.background};
  z-index: 10;
`;

const Body = styled.div`
  height: 70vh;
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
  @media (max-width: 700px) {
    width: 100%;
  }
`;


/** LINKS **/

const AwesomeLink = styled(Link)``;


/** SVG GRAPHICS **/

// https://codesandbox.io/s/v303jqkyk7?from-embed
const AwesomeLogo = styled(logo)`
  height: 6rem;
  display: inline-block;
  margin: 0 auto;
`;

const SearchIcon = styled(searchIcon)`
  height: 13rem;
  width: 13rem;
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
