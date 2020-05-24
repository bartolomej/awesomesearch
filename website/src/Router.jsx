import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./screens/Home";
import Search from "./screens/Search";
import { ThemeProvider } from "styled-components";
import { theme } from "./colors";
import styled from "styled-components";
import List from "./screens/List";


export default function App () {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContainer>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/discover" component={Search}/>
            <Route path="/list/:uid" component={List}/>
          </Switch>
        </AppContainer>
      </Router>
    </ThemeProvider>
  )
}

const AppContainer = styled.div`
  background: ${props => props.theme.background};
  animation: 0.8s ease fadeIn forwards;
  @keyframes fadeIn {
    0% { opacity: 0 }
    100% { opacity: 1 }
  }
`;
