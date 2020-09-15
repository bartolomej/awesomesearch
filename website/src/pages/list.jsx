import React from "react";
import { useHistory, useParams } from 'react-router-dom';
import useSWR, { useSWRInfinite } from "swr";
import { request } from "../utils";
import { useInView } from "react-intersection-observer";
import Layout from "../components/layout";
import {
  BackButton,
  Body,
  Header,
  LinkCss,
  LoadingWrapper,
  ResultsCountTitle,
  ResultsWrapper,
} from "../style/ui";
import UseAnimations from "react-useanimations";
import Result from "../components/result";
import styled from "@emotion/styled";
import Description from "../components/description";
import theme from "../style/theme";
import SearchField from "../components/searchfield";


function ListPage () {
  const history = useHistory();
  const [ref, inView] = useInView({ threshold: 0 });
  const { uid, query } = useParams();

  const {
    data: searchRes,
    error: searchError,
    size: searchSize,
    setSize: setSearchSize
  } = useSWRInfinite(
    (index, d) => {
      if (d && d.results.length === 0) return null;
      return `/list/${uid}/link/search?q=${query}&page=${index}&limit=20`
    },
    url => query ? request(url) : {}
  );
  const {
    data: list,
    error: listError
  } = useSWR(uid, () => request(`/list/${uid}`));
  const {
    data: linkRes,
    error: listsError,
    size,
    setSize
  } = useSWRInfinite(
    (index, d) => {
      if (d && d.length === 0) return null;
      return `/list/${uid}/link?page=${index}&limit=20`;
    },
    request
  );

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    if (inView === true) {
      setSize(size + 1);
    }
  }, [inView]);

  const links = linkRes ? [].concat(...linkRes) : [];
  const search = searchRes ? [].concat(...searchRes.map(r => r.results)) : [];

  return (
    <Layout>
      <Header>
        <BackButton onClick={() => history.replace(`/`)}>
          Back
        </BackButton>
        <ListImage src={list ? list.image_url : ''}/>
        <TitleLink href={list ? list.url : ''} rel="noopener noreferrer"
                   target="_blank">
          {list ? list.title : 'Loading...'}
        </TitleLink>
        <Description
          color={theme.color.light}
          text={list ? list.description : 'Loading...'}
          emojis={list ? list.emojis : []}
        />
        <InfoWrapper>
          <InfoItem>🔗 {list ? list.link_count : '-'} links</InfoItem>
          <InfoItem>⚒️ {list ? list.forks : '-'} forks</InfoItem>
          <InfoItem>⭐️ {list ? list.stars : '-'} stars</InfoItem>
        </InfoWrapper>
        <TagWrapper>
          {list && list.tags.map(t =>
            <Tag
              target="_blank"
              rel="noopener noreferrer"
              href={`https://github.com/topics/${t}`}>{t}</Tag>
          )}
        </TagWrapper>
        <SearchField
          placeholder={`Search in ${list ? list.title : '-'} ...`}
          onSubmit={q => q === ''
            ? history.push(`/list/${uid}`)
            : history.push(`/list/${uid}/search/${q}`)
          }
        />
      </Header>
      <Body>
        {!links && (
          <LoadingWrapper>
            <UseAnimations
              animationKey="infinity"
              size={150}
            />
          </LoadingWrapper>
        )}
        {query && searchRes && (
          <ResultsCountTitle>Found {searchRes ? searchRes[0].total_results : '-'} links</ResultsCountTitle>
        )}
        {!query && links && links.length > 0 && (
          <ResultsWrapper>
            {links.map((r, i) => (
              <Result
                key={r.uid}
                uid={r.uid}
                innerRef={i === links.length - 5 ? ref : null}
                title={r.title}
                url={r.url}
                type={r.object_type}
                description={r.description}
                screenshot={r.screenshot_url || r.image_url}
                emojis={r.emojis}
              />
            ))}
          </ResultsWrapper>
        )}
        {query && search && search.length > 0 && (
          <ResultsWrapper>
            {search.map((r, i) => (
              <Result
                key={r.uid}
                uid={r.uid}
                innerRef={i === search.length - 5 ? ref : null}
                title={r.title}
                url={r.url}
                type={r.object_type}
                description={r.description}
                screenshot={r.screenshot_url || r.image_url}
                emojis={r.emojis}
              />
            ))}
          </ResultsWrapper>
        )}
      </Body>
    </Layout>
  )
}

const TitleLink = styled.a`
  margin: 10px 0 20px 0;
  font-size: ${p => p.theme.size(1.8)};
  color: ${p => p.theme.color.white};
  padding: 2px 4px;
  ${p => LinkCss(
  p.theme.color.red,
  p.theme.color.red,
  p.theme.color.red,
  p.theme.color.white
)};
`;

const ListImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;

const TagWrapper = styled.div`
  margin: 5px 0 20px 0;
  z-index: 1;
`;

const Tag = styled.a`
  background: ${p => p.theme.opacity(p.theme.color.red, 100)};
  color: ${p => p.theme.color.light};
  font-size: 14px;
  border-radius: 15px;
  padding: 5px 10px;
  margin: 0 5px;
  display: inline-block;
  &:hover {
    background: ${p => p.theme.opacity(p.theme.color.red, 200)};
  }
`;

const InfoWrapper = styled.div`
  margin: 10px 0;
`;

const InfoItem = styled.span`
  color: ${p => p.theme.color.light};
  margin: 0 10px;
  display: inline-block;
`;

export default ListPage;
