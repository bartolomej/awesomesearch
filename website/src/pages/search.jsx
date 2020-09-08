import { useHistory, useParams } from "react-router-dom";
import useSWR from "swr";
import { getSearchResults, getStats, getSuggestions } from "../data/api";
import Layout from "../components/layout";
import Animation from "../components/animation";
import SearchField from "../components/searchfield";
import UseAnimations from "react-useanimations";
import Result from "../components/result";
import React from "react";
import {
  AnimationWrapper,
  Body,
  Header,
  LoadingWrapper,
  Logo, ResultsWrapper,
  Title
} from "../style/ui";


function SearchPage () {
  const { query } = useParams();
  const history = useHistory();

  const { data: stats } = useSWR('stats', getStats);
  const {
    data: suggestions,
    mutate: mutateSuggestions
  } = useSWR(`suggestions-${query}`, getSuggestions(query));
  const {
    data: search,
    error: searchError
  } = useSWR(`search-${query}`, () => getSearchResults(query));

  console.log(query)

  return (
    <Layout>
      <Header>
        <AnimationWrapper>
          <Animation speed={0} color={'rgb(254,206,168)'}/>
        </AnimationWrapper>
        <Logo/>
        <Title>Search {stats && <span>{stats.link_count}</span>} links from <a
          target="_blank" href="https://awesome.re">awesome</a></Title>
        <SearchField
          initialText={query}
          onChange={q => mutateSuggestions(getSuggestions(q))}
          onSubmit={q => history.push(`/search/${q}`)}
          placeholder={"Search anything ..."}
          suggestions={suggestions ? suggestions.result : []}
        />
      </Header>
      <Body>
        {!search && (
          <LoadingWrapper>
            <UseAnimations
              animationKey="infinity"
              size={150}
            />
          </LoadingWrapper>
        )}
        {search && search.result.length > 0 && (
          <ResultsWrapper>
            {search.result.map((r, i) => (
              <Result
                key={r.uid}
                uid={r.uid}
                // onSourceClick={uid => setShowSource(uid)}
                // innerRef={i === search.result.length - 5 ? ref : null}
                title={r.title}
                url={r.url}
                type={r.object_type}
                description={r.description}
                screenshot={r.screenshot_url || r.image_url}
                source={r.source}
                emojis={r.emojis}
              />
            ))}
          </ResultsWrapper>
        )}
      </Body>
    </Layout>
  )
}

export default SearchPage;
