import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Layout from '../components/layout';
import SEO from '../components/seo';
import SearchField from "../components/searchfield";
import logo from '../assets/logo.svg';
import noResults from '../assets/no-results.svg';
import glasses from '../assets/glasses.svg'
import error from '../assets/error.svg';
import { connect } from "react-redux";
import search from "../store/search";
import Result from "../components/result";
import { useInView } from "react-intersection-observer";
import UseAnimations from "react-useanimations";
import Modal from "../components/modal";
import { getStats } from "../store/api";
import { ButtonCss, LinkCss, SubtitleCss } from "../style/ui";
import Description from "../components/description";
import theme from "../style/theme";
import Animation from "../components/animation";
import lists from "../store/lists";


const IndexPage = ({
  results,
  suggestions,
  search,
  suggest,
  searchLoading,
  nextPage,
  nextPageIndex,
  query,
  searchError,
  listLoading,
  getAllLists,
  getSingleList,
  lists,
  listInfo,
  listError
}) => {
  const [ref, inView, entry] = useInView({ threshold: 0 });
  const [showSource, setShowSource] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (inView === true) {
      nextPage(query, nextPageIndex);
    }
  }, [inView]);

  useEffect(() => {
    // there was an empty query
    if (results.length === 0 && query.length === 0 && lists.length === 0) {
      getAllLists();
    }
  }, [query]);

  useEffect(() => {
    if (showSource) {
      getSingleList(showSource);
    }
  }, [showSource])

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  return (
    <Layout>
      <SEO
        title="Home"
        keywords={[`awesome`, `awesome-list`, `search`, `resources`, `learning`]}
      />
      {showSource && (
        <Modal onClose={() => setShowSource(null)}>
          {!listLoading && (
            <LoadingWrapper>
              <UseAnimations
                animationKey="infinity"
                size={150}
              />
            </LoadingWrapper>
          )}
          {listInfo && (
            <RepoView
              url={listInfo.url}
              image={listInfo.image_url}
              tags={listInfo.tags}
              stars={listInfo.stars}
              forks={listInfo.forks}
              title={listInfo.title}
              description={listInfo.description}
              emojis={listInfo.emojis}
            />
          )}
        </Modal>
      )}
      <Header>
        <AnimationWrapper>
          <Animation color={'#FECEA890'}/>
        </AnimationWrapper>
        <Logo/>
        <Title>Search <span>{stats.link_count}</span> links from <a target="_blank" href="https://awesome.re">awesome</a></Title>
        <SearchField
          onChange={q => suggest(q)}
          onSubmit={q => search(q)}
          placeholder={"Search anything ..."}
          suggestions={suggestions}
        />
      </Header>
      <Body>
        {searchLoading && (
          <LoadingWrapper>
            <UseAnimations
              animationKey="infinity"
              size={150}
            />
          </LoadingWrapper>
        )}
        {(listError && query.length === 0) && (
          <MessageWrapper>
            <ErrorIcon/>
            <strong>Oops!</strong>
            <span>Failed to load lists because: {listError.message.toLowerCase()}</span>
          </MessageWrapper>
        )}
        {(searchError && query.length > 0) && (
          <MessageWrapper>
            <ErrorIcon/>
            <strong>Oops!</strong>
            <span>Failed to load search results because: {searchError.message.toLowerCase()}</span>
          </MessageWrapper>
        )}
        {(results.length === 0 && query.length > 0 && !searchError) && (
          <MessageWrapper>
            <NoResultsIcon/>
            <strong>Nothing found here</strong>
          </MessageWrapper>
        )}
        {(results.length === 0 && query.length === 0 && !listError) && (
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

function RepoView ({ title, description, stars, forks, links = 120, url, tags, image, emojis }) {

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  const Logo = styled(glasses)`
  
  `;

  const DescWrapper = styled.div`
    max-width: 500px;
    padding: 10px 0;
  `;

  const Link = styled.a`
    display: block;
    width: 120px;
    margin: 15px;
    ${ButtonCss};
  `;

  const StatsWrapper = styled.div`
    display: flex;
    text-align: center;
  `;

  const Subtitle = styled.h3`
    ${SubtitleCss};
    margin-top: 10px;
    margin-bottom: 20px;
  `;

  const StatsElement = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 20px;
    padding: 20px;
    background: white;
    border-radius: 5px;
  `;

  return (
    <Container>
      <Logo/>
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
      <DescWrapper>
        <Description
          color={theme.color.dark}
          text={description}
          emojis={emojis}
          maxLength={null}
        />
      </DescWrapper>
      <Link target="_blank" href={url}>
        View on Github
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
  padding: 60px 0;
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
  padding-top: 2em;
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
  padding: 50px 0;
  strong {
    font-size: ${p => p.theme.size(1.6)};
    color: ${p => p.theme.color.dark};
    margin: 20px 0;
  }
`;

const Body = styled.div`
  position: relative;
  min-height: 80vh;
  background: ${p => p.theme.color.light};
`

const ResultsWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 0 auto;
  padding: 80px 0;
  width: 80%;
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
  searchError: state.search.error,
  searchLoading: state.search.loading,
  listLoading: state.lists.loading,
  query: state.search.query,
  lists: state.lists.results,
  listInfo: state.lists.result,
  listError: state.lists.error
});

const mapDispatchToProps = dispatch => ({
  search: search.search(dispatch),
  suggest: search.suggest(dispatch),
  nextPage: search.nextSearchPage(dispatch),
  getAllLists: lists.getAllLists(dispatch),
  getSingleList: lists.getSingle(dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IndexPage);
