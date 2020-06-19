import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Layout from '../components/layout';
import SEO from '../components/seo';
import SearchField from "../components/searchfield";
import Glasses from '../assets/glasses.svg';
import { connect } from "react-redux";
import search from "../store/search";
import Result from "../components/result";
import { useInView } from "react-intersection-observer";
import UseAnimations from "react-useanimations";
// icons
import line from '../assets/line.svg';
import triangle from '../assets/triangle.svg';
import circle from '../assets/circle.svg';

const nShapes = 20;
const IndexPage = ({ results, suggestions, search, suggest, loading, nextPage, nextPageIndex }) => {
  const [ref, inView, entry] = useInView({ threshold: 0 });
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const headerRef = React.createRef();

  useEffect(() => {
    setW(headerRef.current.clientWidth);
    setH(headerRef.current.clientHeight - 50);
  }, [headerRef])

  useEffect(() => {
    if (inView === true) {
      nextPage(nextPageIndex);
    }
  }, [inView]);

  return (
    <Layout>
      <SEO
        title="Home"
        keywords={[`awesome`, `awesome-list`, `search`, `resources`, `learning`]}
      />
      <Header ref={headerRef}>
        {/*{new Array(nShapes).fill(0).map((e, i) => {*/}
        {/*  if (i % 2 === 0) {*/}
        {/*    const S = Shape(line);*/}
        {/*    return <S x={Math.random() * w} y={Math.random() * h}/>;*/}
        {/*  } else if (i % 3 === 0) {*/}
        {/*    const S = Shape(circle);*/}
        {/*    return <S x={Math.random() * w} y={Math.random() * h}/>;*/}
        {/*  } else {*/}
        {/*    const S = Shape(triangle);*/}
        {/*    return <S x={Math.random() * w} y={Math.random() * h}/>;*/}
        {/*  }*/}
        {/*})}*/}
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
        {loading && (
          <LoadingWrapper>
            <UseAnimations
              animationKey="infinity"
              size={150}
            />
          </LoadingWrapper>
        )}
        {results.map((r, i) => (
          <Result
            innerRef={i === results.length - 5 ? ref : null}
            title={r.title}
            url={r.url}
            description={r.description}
            screenshot={r.screenshot_url}
            source={r.source}
            emojis={r.emojis}
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
  position: relative;
  background: ${p => p.theme.color.dark};
`;

const Title = styled.p`
  font-size: ${p => p.theme.size(2)};
  color: ${p => p.theme.color.white};
  margin-top: 10px;
  margin-bottom: 30px;
  & > span {
    color: ${p => p.theme.color.red};
  }
  @media (max-width: 700px) {
    font-size: ${p => p.theme.size(1.4)};
    text-align: center;
    width: 90%;
  }
`;

const Logo = styled(Glasses)`
  margin: 20px;
`;

const Shape = shape => styled(shape)`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  opacity: ${Math.random() * 100}%;
  transform: rotate(${Math.random() * 90}deg);
`;

const Body = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin: 50px auto;
  width: 80%;
  position: relative;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

