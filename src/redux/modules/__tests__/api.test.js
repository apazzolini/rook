import { expect } from 'chai';
import Immutable from 'immutable';
import createReducer from '../../createReducer';
import * as api from '../api';
const reducer = createReducer(api);

describe('redux', () => {
  describe('reducers', () => {
    describe('api', () => {
      const initialState = Immutable.fromJS(reducer.initialState);

      it('handles apiLoadingStart', () => {
        const newState = reducer(initialState, {
          type: '@@rook/apiLoadingStart'
        });

        expect(newState.toJS()).to.deep.equal({
          loading: true
        });
      });

      it('handles apiLoadingFinish', () => {
        const error = {
          toString: () => 'toString',
          stack: 'stack'
        };

        const newState = reducer(initialState, {
          type: '@@rook/apiLoadingFinish',
          loadError: error
        });

        expect(newState.toJS()).to.deep.equal({
          loading: false,
          loadError: {
            msg: 'toString',
            stack: 'stack'
          }
        });
      });

    });
  });
});


