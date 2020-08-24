import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout } from "./layouts";

// Route Views
import Overview from "./views/Overview";
import CreateJob from "./views/CreateJob";
import Lists from "./views/Lists";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/overview" />
  },
  {
    path: "/overview",
    layout: DefaultLayout,
    component: Overview
  },
  {
    path: "/job",
    layout: DefaultLayout,
    component: CreateJob
  },
  {
    path: "/lists",
    layout: DefaultLayout,
    component: Lists
  },
];
