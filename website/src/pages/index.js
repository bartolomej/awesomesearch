import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Layout from '../components/layout';
import SEO from '../components/seo';
import SearchField from "../components/searchfield";
import logo from '../assets/logo.svg';
import noResults from '../assets/no-results.svg';
import error from '../assets/error.svg';
import { connect } from "react-redux";
import search from "../store/search";
import Result from "../components/result";
import { useInView } from "react-intersection-observer";
import UseAnimations from "react-useanimations";
import Modal from "../components/modal";
import { getAllLists, getList } from "../store/api";
import { ButtonCss, LinkCss, SubtitleCss } from "../style/ui";
import Description from "../components/description";
import theme from "../style/theme";
import Animation from "../components/animation";


const IndexPage = ({ results, suggestions, search, suggest, loading, nextPage, nextPageIndex, query, error }) => {
  const [ref, inView, entry] = useInView({ threshold: 0 });
  const [showSource, setShowSource] = useState(null);
  const [repo, setRepo] = useState(null);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    if (inView === true) {
      nextPage(nextPageIndex);
    }
  }, [inView]);

  useEffect(() => {
    // there was a query with no results
    if (results.length === 0 && query.length > 0) {

    }
    // there was an empty query
    if (results.length === 0 && query.length === 0) {
      getAllLists().then(setLists);
    }
  }, [query]);

  useEffect(() => {
    if (showSource) {
      getList(showSource).then(setRepo);
    }
  }, [showSource])

  return (
    <Layout>
      <SEO
        title="Home"
        keywords={[`awesome`, `awesome-list`, `search`, `resources`, `learning`]}
      />
      {showSource && (
        <Modal onClose={() => setShowSource(null)}>
          {!repo && (
            <LoadingWrapper>
              <UseAnimations
                animationKey="infinity"
                size={150}
              />
            </LoadingWrapper>
          )}
          {repo && (
            <RepoView
              url={repo.url}
              image={repo.image_url}
              tags={repo.tags}
              stars={repo.stars}
              forks={repo.forks}
              title={repo.title}
              description={repo.description}
              emojis={repo.emojis}
            />
          )}
        </Modal>
      )}
      <Header>
        <AnimationWrapper>
          <Animation color={'#FECEA890'} />
        </AnimationWrapper>
        <Logo/>
        <Title>Search <span>21600</span> links from <a target="_blank" href="https://awesome.re">awesome</a></Title>
        <SearchField
          onChange={q => suggest(q)}
          onSubmit={q => search(q)}
          placeholder={"Search anything ..."}
          suggestions={suggestions}
        />
      </Header>
      <Body>
        {loading && (
          <LoadingWrapper>
            <UseAnimations
              animationKey="infinity"
              size={150}
            />
          </LoadingWrapper>
        )}
        {error && (
          <MessageWrapper>
            <ErrorIcon/>
            <strong>Oops!</strong>
          </MessageWrapper>
        )}
        {(results.length === 0 && query.length > 0 && !error) && (
          <MessageWrapper>
            <NoResultsIcon/>
            <strong>Nothing found here</strong>
          </MessageWrapper>
        )}
        {(results.length === 0 && query.length === 0 && !error) && (
          <>
            <Subtitle>Browse lists</Subtitle>
            <ResultsWrapper>
              {lists.map((r, i) => (
                <Result
                  uid={r.uid}
                  onSourceClick={uid => setShowSource(uid)}
                  innerRef={i === results.length - 5 ? ref : null}
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
          </>
        )}
        {results.length > 0 && (
          <ResultsWrapper>
            {results.map((r, i) => (
              <Result
                uid={r.uid}
                onSourceClick={uid => setShowSource(uid)}
                innerRef={i === results.length - 5 ? ref : null}
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
};

function RepoView ({ title, description, stars, forks, links, url, tags, image, emojis }) {

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const Link = styled.a`
    display: block;
    width: 100px;
    margin: 15px;
    ${ButtonCss};
  `;

  const StatsWrapper = styled.div`
    display: flex;
  `;

  const Subtitle = styled.h3`
    ${SubtitleCss}
  `;

  const StatsElement = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 20px;
  `;

  return (
    <Container>
      <Subtitle>{formatTitle(title)}</Subtitle>
      <StatsWrapper>
        <StatsElement>
          <strong>{links}</strong>
          <span>links</span>
        </StatsElement>
        <StatsElement>
          <strong>{stars}</strong>
          <span>stars</span>
        </StatsElement>
        <StatsElement>
          <strong>{forks}</strong>
          <span>forks</span>
        </StatsElement>
      </StatsWrapper>
      <Description
        color={theme.color.dark}
        text={description}
        emojis={emojis}
        maxLength={null}
      />
      <Link target="_blank" href={url}>
        Go to Github
      </Link>
    </Container>
  )
}

function formatTitle (text) {
  return text
    .replace('-', ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const Header = styled.header`
  width: 100vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  background: ${p => p.theme.color.dark};
`;

const AnimationWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Title = styled.p`
  font-size: ${p => p.theme.size(1.8)};
  color: ${p => p.theme.color.white};
  margin-top: 10px;
  margin-bottom: 30px;
  z-index: 1;
  & > span {
    color: ${p => p.theme.color.red};
  }
  & > a {
    padding: 0 2px;
    ${p => LinkCss(
      p.theme.color.red,
      p.theme.color.red,
      p.theme.color.red,
      p.theme.color.white
    )};
  }
  @media (max-width: 700px) {
    font-size: ${p => p.theme.size(1)};
    text-align: center;
    width: 90%;
    margin-bottom: 10px;
    margin-top: 5px;
  }
`;

const Subtitle = styled.h3`
  ${SubtitleCss};
  margin-top: 2.4em;
`;

const Logo = styled(logo)`
  margin: 20px;
  width: 120px;
  height: 120px;
  z-index: 1;
  @media (max-width: 700px) {
    height: 70px;
    margin: 10px;
  }
`;

const NoResultsIcon = styled(noResults)`
  height: 250px;
  width: 250px;
`;

const ErrorIcon = styled(error)`
  height: 250px;
  width: 250px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  strong {
    font-size: ${p => p.theme.size(1.6)};
    color: ${p => p.theme.color.dark};
    margin: 20px 0;
  }
`;

const Body = styled.div``

const ResultsWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 80px auto;
  width: 80%;
  position: relative;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  display: flex;
  justify-content: center;
  backdrop-filter: blur(7px);
  svg:only-child {
    height: 150px !important;
    width: 150px !important;
    margin-top: 100px;
    color: ${p => p.theme.color.red};
    filter: glow(1);
  }
`;

const mapStateToProps = state => ({
  nextPageIndex: state.search.nextPage,
  results: state.search.results,
  suggestions: state.search.suggestions,
  error: state.search.error,
  loading: state.search.loading,
  query: state.search.query
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
