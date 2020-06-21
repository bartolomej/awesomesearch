import { combineReducers } from 'redux';
import search from './search';
import lists from "./lists";

export default combineReducers({ search: search.reducer, lists: lists.reducer });
