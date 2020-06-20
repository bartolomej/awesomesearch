import { createSlice } from "@reduxjs/toolkit";
import * as api from "./api";


const initialState = {
  query: '',
  loading: false,
  error: null,
  currentPage: 0,
  nextPage: null,
  results: [],
  suggestions: []
}

const store = createSlice({
  name: 'search',
  initialState,
  reducers: {
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
    .catch(error => dispatch(store.actions.searchFailed(error)))
}

const nextPage = dispatch => (query, pageIndex) => {
  dispatch(store.actions.nextPagePending());
  api.search(query, pageIndex)
    .then(res => dispatch(store.actions.nextPageSuccess(res)))
    .catch(error => dispatch(store.actions.nextPageFailed(error)))
}

export default {
  reducer: store.reducer,
  suggest,
  search,
  nextPage
}
