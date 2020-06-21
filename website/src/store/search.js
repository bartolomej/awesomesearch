import { createSlice } from "@reduxjs/toolkit";
import * as api from "./api";


const initialState = {
  query: '',
  loading: false,
  error: null,
  currentPage: 0,
  nextPage: null,
  results: [],
  lists: [],
  suggestions: []
}

// possibly remove redux and use react-query instead
const store = createSlice({
  name: 'search',
  initialState,
  reducers: {
    getListsPending (state) {
      state.loading = true;
      state.error = null;
    },
    getListsSuccess (state, action) {
      state.loading = false;
      state.lists = action.payload;
    },
    getListsFailed (state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    suggestPending (state) {
      state.error = null;
    },
    suggestSuccess (state, action) {
      state.suggestions = action.payload.result || []
    },
    suggestFailed (state, action) {
      state.error = action.payload;
    },
    searchPending (state, action) {
      state.loading = true;
      state.error = null;
      state.query = action.payload;
    },
    searchSuccess (state, action) {
      state.loading = false;
      state.currentPage = action.payload.page;
      state.nextPage = action.payload.next;
      state.results = action.payload.result
    },
    searchFailed (state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    nextPagePending (state) {
      state.error = null;
    },
    nextPageSuccess (state, action) {
      state.currentPage = action.payload.page;
      state.nextPage = action.payload.next;
      state.results = [
        ...state.results,
        ...action.payload.result
      ]
    },
    nextPageFailed (state, action) {
      state.error = action.payload;
    },
  }
});

const suggest = dispatch => query => {
  dispatch(store.actions.suggestPending());
  api.suggest(query)
    .then(res => dispatch(store.actions.suggestSuccess(res)))
    .catch(error => dispatch(store.actions.suggestFailed(error)))
}

const search = dispatch => query => {
  dispatch(store.actions.searchPending(query));
  api.search(query)
    .then(res => dispatch(store.actions.searchSuccess(res)))
    .catch(error => {
      if (error.message === 'Query param required') {
        // recognise as successful query with empty result
        dispatch(store.actions.searchSuccess({
          page: 0, next: null, result: []
        }));
      } else {
        dispatch(store.actions.searchFailed(error));
      }
    })
}

const nextSearchPage = dispatch => (query, next) => {
  if (next === null) return;
  dispatch(store.actions.nextPagePending());
  api.search(query, next)
    .then(res => dispatch(store.actions.nextPageSuccess(res)))
    .catch(error => dispatch(store.actions.nextPageFailed(error)))
}

const getAllLists = dispatch => (page) => {
  dispatch(store.actions.nextPagePending());
  api.getAllLists()
    .then(res => dispatch(store.actions.nextPageSuccess(res)))
    .catch(error => dispatch(store.actions.nextPageFailed(error)))
}

export default {
  reducer: store.reducer,
  suggest,
  search,
  nextSearchPage
}
