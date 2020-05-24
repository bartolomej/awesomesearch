import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchBar from "../components/SearchBar";
import { ReactComponent as searchIcon } from "../assets/unbox.svg";
import { ReactComponent as errorIcon } from "../assets/cancel.svg";
import SearchEngine from "../search";
import { MessageText, MessageWrapper } from "../components/ui";
import UseAnimations from "react-useanimations";
import { theme } from "../colors";
import { useInView } from "react-intersection-observer";
import ResultItem from "../components/ResultItem";
import HeaderBar from "../components/HeaderBar";
import { LinksContainer } from "../styles";


const search = new SearchEngine();

export default function Search () {
  const [error, setError] = useState(null);
  const [result, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [ref, inView, entry] = useInView({ threshold: 0 });

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
      setResults(await search.run(query));
    } catch (e) {
      setError(e);
      console.log(e);
    }
    setLoading(false);
  }

  return (
    <Container>
      <HeaderBar>
        <SearchBar
          results={getResults().length}
          placeholder={"Enter search term..."}
          onChange={query => fetchResults(query)}
        />
      </HeaderBar>
      <LinksContainer top={'7vh'}>
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
            <MessageText>Discover Awesome collection !</MessageText>
          </MessageWrapper>
        )}
        {!loading && getResults().map((r, i) => (
          <ResultItem
            key={i}
            innerRef={i === getResults().length - 5 ? ref : null}
            type={r.object_type}
            screenshot={r.screenshot_url}
            url={r.url}
            image={r.image_url}
            sourceUrl={'http://api.awesomesearch.in/list/amnashanwar.awesome-portfolios'}
            sourceImage={'https://avatars3.githubusercontent.com/u/31182732?v=4'}
            sourceUid={r.source_list}
            title={r.title}
            tags={r.tags}
            topics={r.topics}
            description={r.description}
            styles={i === 0 ? 'margin-top: 50px !important;' : ''}
          />
        ))}
      </LinksContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
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
