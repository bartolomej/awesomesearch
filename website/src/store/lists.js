import { createSlice } from "@reduxjs/toolkit";
import * as api from "./api";


const initialState = {
  loading: false,
  error: null,
  currentPage: 0,
  nextPage: null,
  results: [],
  result: null
}

// possibly remove redux and use react-query instead
const store = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    getListsPending (state) {
      state.loading = true;
      state.error = null;
    },
    getListsSuccess (state, action) {
      state.loading = false;
      state.results = action.payload;
    },
    getListsFailed (state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    getSinglePending (state) {
      state.loading = true;
      state.error = null;
    },
    getSingleSuccess (state, action) {
      state.loading = false;
      state.result = action.payload;
    },
    getSingleFailed (state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

const getAllLists = dispatch => (page) => {
  dispatch(store.actions.getListsPending());
  api.getAllLists()
    .then(res => dispatch(store.actions.getListsSuccess(res)))
    .catch(error => dispatch(store.actions.getListsFailed(error)))
}

const getSingle = dispatch => (uid) => {
  dispatch(store.actions.getSinglePending());
  api.getList(uid)
    .then(res => dispatch(store.actions.getSingleSuccess(res)))
    .catch(error => dispatch(store.actions.getSingleFailed(error)))
}

export default {
  reducer: store.reducer,
  getAllLists,
  getSingle
}
