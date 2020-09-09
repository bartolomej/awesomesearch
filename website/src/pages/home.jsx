import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from '@emotion/styled/macro';
import Layout from '../components/layout';
import SearchField from "../components/searchfield";
import Result from "../components/result";
import UseAnimations from "react-useanimations";
import {
  Body,
  Header,
  LoadingWrapper,
  Logo,
  ResultsWrapper,
  Subtitle,
  Title
} from "../style/ui";
import useSWR from 'swr';
import { request } from "../utils";


function HomePage () {
  const { data: stats } = useSWR('stats', () => request('/stats'));
  const {
    data: suggestions,
    mutate: mutateSuggestions
  } = useSWR('suggestions', () => request(`/suggest?q=`));
  const {
    data: lists,
    error: listsError
  } = useSWR('lists', () => request(`/list`));
  const history = useHistory();

  return (
    <Layout>
      <Header>
        <Logo/>
        <Title>Search {stats && <span>{stats.link_count}</span>} links from <a
          target="_blank" href="https://awesome.re">awesome</a></Title>
        <SearchField
          onChange={q => mutateSuggestions(request(`/suggest?q=${q}`))}
          onSubmit={q => history.push(`/search/${q}`)}
          placeholder={"Search anything ..."}
          suggestions={suggestions ? suggestions.result : []}
        />
      </Header>
      <Body>
        {!lists && (
          <LoadingWrapper>
            <UseAnimations
              animationKey="infinity"
              size={150}
            />
          </LoadingWrapper>
        )}
        {(lists && !listsError) && (
          <>
            <Subtitle>Browse lists</Subtitle>
            <ResultsWrapper>
              {lists.map((r, i) => (
                <Result
                  key={r.uid}
                  uid={r.uid}
                  onSourceClick={uid => history.push(`/list/${uid}`)}
                  // TODO: implement pagination (for when there are lots of lists)
                  // innerRef={i === lists.length - 5 ? ref : null}
                  title={r.title}
                  url={r.url}
                  type={r.object_type}
                  description={r.description}
                  screenshot={r.screenshot_url || r.image_url}
                  emojis={r.emojis}
                  displayOnHover={
                    <RepositoryStats
                      forksCount={r.forks}
                      starsCount={r.stars}
                    />
                  }
                />
              ))}
            </ResultsWrapper>
          </>
        )}
      </Body>
    </Layout>
  )
}

function RepositoryStats ({ starsCount, forksCount }) {

  const Wrapper = styled.div`
    flex-direction: column;
  `;

  const Stat = styled.div`
    color: ${p => p.theme.color.light};
    font-weight: bold;
    font-size: 14px;
  `;

  return (
    <Wrapper>
      <Stat>⭐️ {starsCount} stars</Stat>
      <Stat>⚒️️ {forksCount} forks</Stat>
    </Wrapper>
  )
}

export default HomePage;
