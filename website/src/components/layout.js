import React from 'react';
import PropTypes from 'prop-types';
import { Link as GLink } from 'gatsby';
import styled from '@emotion/styled';
import { ThemeProvider } from 'emotion-theming';
import theme from '../style/theme';
import "../style/index.css";
import { LinkCss } from "../style/ui";


const Layout = ({ children }) => (
  <ThemeProvider theme={theme}>
    <Container>
      <Navigation>
        <Link to="/about">About</Link>
      </Navigation>
      {children}
      <Footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </Footer>
    </Container>
  </ThemeProvider>
);

const Container = styled.main`
  width: 100vw;
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
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.theme.color.dark};
`;

const Link = styled(GLink)`
  color: ${p => p.theme.color.white};
  margin-right: 20px;
  border-radius: 10px !important;
  padding: 8px 10px !important;
  ${p => LinkCss(
  'transparent',
  p.theme.color.red,
  p.theme.color.red,
  p.theme.color.white
)};
`;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
