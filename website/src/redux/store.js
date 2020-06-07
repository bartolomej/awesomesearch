import { combineReducers, createStore } from "redux";

const initialState = {
  query: null,
  results: []
}

function searchReducer (state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_RESULT':
      return {
        query: action.payload.query,
        results: action.payload.results
      }
    case 'NEXT_PAGE_RESULT':
      return {
        ...state,
        results: [
          ...state.results,
          ...action.payload
        ]
      }
    default:
      return state
  }
}

export default createStore(
  combineReducers({ search: searchReducer })
);
