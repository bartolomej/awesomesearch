import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import SearchPage from "./pages/search";
import HomePage from "./pages/home";
import { ThemeProvider } from "emotion-theming";
import theme from "./style/theme";
import ListPage from "./pages/list";


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
          <Route exact path="/">
            <HomePage/>
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  )
};

export default IndexPage;
