import { ReducerFactory } from '../lib/util'
import {
  TOKEN_FETCH_PENDING,
  TOKEN_FETCH_SUCCESS,
  TOKEN_REMOVE,
  TOKENS_FETCH_PENDING,
  TOKENS_FETCH_SUCCESS,
} from '../constants/action'

const DState = {
  tokens: {},
  loading: false,
}

const Actions = {
  [TOKEN_FETCH_PENDING]: state => ({
    ...state,
    loading: true,
  }),

  [TOKEN_FETCH_SUCCESS]: (state, { accAddr, token }) => {
    const tokens = state.tokens[accAddr] || []
    return {
      ...state,
      loading: false,
      tokens: {
        ...state.tokens,
        [accAddr]: [...tokens, token],
      },
    }
  },

  [TOKEN_REMOVE]: (state, { accAddr, index }) => ({
    ...state,
    tokens: {
      ...state.tokens,
      [accAddr]: [
        ...state.tokens[accAddr].slice(0, index),
        ...state.tokens[accAddr].slice(index + 1),
      ],
    },
  }),

  [TOKENS_FETCH_PENDING]: state => ({
    ...state,
    loading: true,
  }),

  [TOKENS_FETCH_SUCCESS]: (state, { accAddr, tokens }) => ({
    ...state,
    loading: false,
    tokens: {
      ...state.tokens,
      [accAddr]: tokens,
    },
  }),
}

export default ReducerFactory(DState, Actions)
