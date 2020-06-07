import SearchEngine from '../search';


const searchEngine = new SearchEngine();

export const search = dispatch => query => {
  searchEngine.run(query)
    .then(results => dispatch({
      type: 'SEARCH_RESULT',
      payload: { query, results }
    }))
    .catch(console.error)
}

export const nextPage = dispatch => () => {
  if (searchEngine.isNextPage()) {
    searchEngine.nextPage()
      .then(results => dispatch({
        type: 'NEXT_PAGE_RESULT',
        payload: results
      }))
  }
}
