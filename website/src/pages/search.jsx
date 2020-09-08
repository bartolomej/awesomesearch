import { useHistory, useParams } from "react-router-dom";
import useSWR, { useSWRInfinite } from "swr";
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
  Logo,
  ResultsWrapper,
  Title
} from "../style/ui";
import { useInView } from "react-intersection-observer";
import { request } from "../utils";


function SearchPage () {
  const [ref, inView, entry] = useInView({ threshold: 0 });
  const { query } = useParams();
  const history = useHistory();

  const { data: stats } = useSWR('stats', request(`/stats`));
  const {
    data: suggestions,
    mutate: mutateSuggestions
  } = useSWR(`suggestions-${query}`, request(`/suggest?q=${query}`));
  const {
    data: searchRes,
    error: searchError,
    size,
    setSize
  } = useSWRInfinite(
    (index, d) => {
      if (d && d.result.length === 0) return null;
      return `/search?q=${query}&page=${index}&limit=20`
    },
    request
  );

  React.useEffect(() => {
    if (inView === true) {
      setSize(size + 1);
    }
  }, [inView]);
  const search = searchRes ? [].concat(...searchRes.map(r => r.result)) : [];

  console.log({ search, searchError, size })

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
          onChange={q => mutateSuggestions(request(`/suggest?q=${query}`))}
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
        {search && search.length > 0 && (
          <ResultsWrapper>
            {search.map((r, i) => (
              <Result
                key={r.uid}
                uid={r.uid}
                // onSourceClick={uid => setShowSource(uid)}
                innerRef={i === search.length - 5 ? ref : null}
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
