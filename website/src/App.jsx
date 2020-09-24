import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import SearchPage from "./pages/search";
import HomePage from "./pages/home";
import { ThemeProvider } from "emotion-theming";
import theme from "./style/theme";
import ListPage from "./pages/list";
import AboutPage from "./pages/about";


const IndexPage = () => {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route
            exact
            path="/search/:query"
            children={<SearchPage/>}
          />
          <Route
            exact
            path="/list/:uid"
            children={<ListPage/>}
          />
          <Route
            exact
            path="/list/:uid/search/:query"
            children={<ListPage/>}
          />
          <Route
            exact
            path="/"
            children={<HomePage/>}
          />
          <Route
            exact
            path="/about"
            children={<AboutPage/>}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  )
};

export default IndexPage;
