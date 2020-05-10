import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Search from "./screens/Search";
import { ThemeProvider } from "styled-components";
import { theme } from "./colors";


export default function App () {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/search" component={Search}/>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}
