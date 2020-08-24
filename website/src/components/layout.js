import React from 'react';
import PropTypes from 'prop-types';
import { Link as GLink } from 'gatsby';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';
import theme from '../style/theme';
import "../style/index.css";
import { BackgroundAppear, LinkCss } from "../style/ui";
import Animation from "./animation";


const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Container>
      <Navigation>
        <Link to="/about">About</Link>
      </Navigation>
      {children}
      <Footer>
        <AnimationWrapper>
          <Animation speed={0.02} color={'rgb(254,206,168)'}/>
        </AnimationWrapper>
        © {new Date().getFullYear()}, Built with
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </Footer>
    </Container>
  </ThemeProvider>
);

const Container = styled.main`
  background: ${p => p.theme.color.light};
`;

const Navigation = styled.nav`
  width: 100vw;
  height: 5vh;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
`;

const Footer = styled.footer`
  min-height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.color.light};
  background: ${p => p.theme.color.dark};
  a {
    margin: 0 4px;
    padding: 2px 2px;
    ${p => LinkCss(
      p.theme.color.red,
      p.theme.color.red,
      p.theme.color.red,
      p.theme.color.white
    )};
  }
`;

const AnimationWrapper = styled.div`
  ${BackgroundAppear};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30vh;
`;

const Link = styled(GLink)`
  color: ${p => p.theme.color.white};
  margin-right: 20px;
  padding: 5px !important;
  ${p => LinkCss(
    p.theme.color.red,
    p.theme.color.red,
    p.theme.color.red,
    p.theme.color.white
  )};
`;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
