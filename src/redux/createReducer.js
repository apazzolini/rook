import Immutable from 'immutable';
import { createReducer as createImmutableReducer } from 'redux-immutablejs';

export default function createReducer(reducer) {
  return createImmutableReducer(Immutable.fromJS(reducer.initialState), reducer.reducers);
}

