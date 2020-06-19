import React from 'react';
import styled from '@emotion/styled';

import Layout from '../components/layout';
import SEO from '../components/seo';
import SearchField from "../components/searchfield";
import Glasses from '../assets/glasses.svg';
import { connect } from "react-redux";
import search from "../store/search";


const IndexPage = ({ results, suggestions, search, suggest }) => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]}/>
    <Header>
        <Glasses/>
        <Title>Search <span>21600</span> links in <span>205</span> awesome lists</Title>
        <SearchField
          onChange={q => suggest(q)}
          onSubmit={q => search(q)}
          placeholder={"Search anything ..."}
          suggestions={suggestions}
        />
    </Header>
    <Body>
        <p>Welcome to your new Gatsby site.</p>
        <p>Now go build something great.</p>
    </Body>
  </Layout>
);

const Header = styled.header`
  width: 100vw;
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${p => p.theme.color.dark};
`;

const Title = styled.p`
  font-size: ${p => p.theme.size(2)};
  color: ${p => p.theme.color.white};
  & > span {
    color: ${p => p.theme.color.red};
  }
`;

const Body = styled.div`
  background: ${p => p.theme.color.light};
  min-height: 75vh;
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

