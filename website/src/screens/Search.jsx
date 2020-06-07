import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import SearchBar from "../components/SearchBar";
import { ReactComponent as searchIcon } from "../assets/unbox.svg";
import { ReactComponent as errorIcon } from "../assets/cancel.svg";
import { MessageText, MessageWrapper } from "../components/ui";
import UseAnimations from "react-useanimations";
import { theme } from "../colors";
import { useInView } from "react-intersection-observer";
import ResultItem from "../components/ResultItem";
import HeaderBar from "../components/HeaderBar";
import { nextPage, search } from "../redux/actions";


function Search ({ search, nextPage, results, loading = false, error = null }) {

  const [ref, inView, entry] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView === true) {
      nextPage();
    }
  }, [inView]);

  return (
    <Container>
      <HeaderBar>
        <SearchBar
          results={results.length}
          placeholder={"Enter search term..."}
          onChange={search}
        />
      </HeaderBar>
      <ResultsContainer>
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
        {(!loading && !error && results.length === 0) && (
          <MessageWrapper>
            <SearchIcon/>
            <MessageText>Discover Awesome collection !</MessageText>
          </MessageWrapper>
        )}
        {!loading && results.map((r, i) => (
          <ResultItem
            key={i}
            innerRef={i === results.length - 5 ? ref : null}
            type={r.object_type}
            screenshot={r.screenshot_url}
            url={r.url}
            image={r.image_url}
            sourceUrl={'http://api.awesomesearch.in/list/amnashanwar.awesome-portfolios'}
            sourceImage={'https://avatars3.githubusercontent.com/u/31182732?v=4'}
            source={r.source}
            title={r.title}
            tags={r.tags}
            topics={r.topics}
            description={r.description}
            styles={i === 0 ? 'margin-top: 50px !important;' : ''}
          />
        ))}
      </ResultsContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const ResultsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 20px;
  position: fixed;
  bottom: 0;
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
  top: 7vh; 
  @media (max-width: 500px) { top: 10vh; }
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

const mapStateToProps = (state) => {
  return {
    results: state.search.results,
    query: state.search.query,
  }
}

const mapDispatchToProps = dispatch => ({
  search: search(dispatch),
  nextPage: nextPage(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
