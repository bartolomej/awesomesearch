import React from 'react';
import styled from '@emotion/styled';

import Layout from '../components/layout';
import SEO from '../components/seo';
import SearchField from "../components/searchfield";
import Glasses from '../assets/glasses.svg';
import { connect } from "react-redux";
import search from "../store/search";
import Result from "../components/result";
// TODO:
// import { useInView } from "react-intersection-observer";

const IndexPage = ({ results, suggestions, search, suggest }) => {
  // TODO: fetch next page
  // const [ref, inView, entry] = useInView({ threshold
  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]}/>
      <Header>
        <Logo/>
        <Title>Search <span>21600</span> links in <span>205</span> awesome lists</Title>
        <SearchField
          onChange={q => suggest(q)}
          onSubmit={q => search(q)}
          placeholder={"Search anything ..."}
          suggestions={suggestions}
        />
      </Header>
      <Body>
        {results.map(r => (
          <Result
            title={r.title}
            description={r.description}
            screenshot={r.screenshot_url}
            source={r.source}
          />
        ))}
      </Body>
    </Layout>
  )
};

const Header = styled.header`
  width: 100vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.theme.color.dark};
`;

const Title = styled.p`
  font-size: ${p => p.theme.size(2)};
  color: ${p => p.theme.color.white};
  margin: 10px 0;
  & > span {
    color: ${p => p.theme.color.red};
  }
`;

const Logo = styled(Glasses)`
  margin: 20px;
`;

const Body = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 20px auto;
  width: 80%;
`;

const mapStateToProps = state => ({
  nextPage: state.search.nextPage,
  results: state.search.results,
  suggestions: state.search.suggestions,
  error: state.search.error,
  loading: state.search.loading,
});

const mapDispatchToProps = dispatch => ({
  search: search.search(dispatch),
  suggest: search.suggest(dispatch),
  nextPage: search.nextPage(dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IndexPage);

