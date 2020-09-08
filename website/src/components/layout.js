import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled/macro';
import { ThemeProvider } from 'emotion-theming';
import theme from '../style/theme';
import "../style/index.css";
import { BackgroundAppear, LinkCss } from "../style/ui";
import Animation from "./animation";


const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <main>
      <TopAnimationWrapper>
        <Animation speed={0.01} color={'rgb(254,206,168)'}/>
      </TopAnimationWrapper>
      <Navigation>
        <Link to="/about">About</Link>
      </Navigation>
      {children}
      <AnimationWrapper>
        <Animation speed={0} color={'rgb(254,206,168)'}/>
      </AnimationWrapper>
      <Footer>
        © {new Date().getFullYear()}, Built by
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.github.com/bartolomej">bartolomej</a>
      </Footer>
    </main>
  </ThemeProvider>
);

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
    z-index: 1;
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

const TopAnimationWrapper = styled.div`
  ${BackgroundAppear};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
`;

const AnimationWrapper = styled.div`
  ${BackgroundAppear};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30vh;
`;

const Link = styled(RouterLink)`
  color: ${p => p.theme.color.red};
  margin-right: 20px;
  padding: 5px 0;
  transition: 0.2s ease-in-out all;
  &:hover {
    box-shadow: inset 0 -2px 0 ${p => p.theme.color.red};
  }
`;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
