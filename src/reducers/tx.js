import { ReducerFactory } from '../lib/util'
import {
  TX_FETCH_PENDING,
  TX_FETCH_SUCCESS,
  TX_FETCH_ERROR,
  TX_CREATION_PENDING,
  TX_CREATION_SUCCESS,
  TX_CREATION_ERROR,
  TX_CREATE_NEW,
} from '../constants/action'

const DState = {
  transactions: [],
  pending: [],
  loading: false,
  creating: false,
  createdTxHash: null,
}

const Actions = {
  [TX_FETCH_PENDING]: state => ({
    ...state,
    loading: true,
  }),

  [TX_FETCH_SUCCESS]: (state, { payload: { transactions } }) => ({
    ...state,
    loading: false,
    transactions: transactions,
  }),

  [TX_FETCH_ERROR]: state => ({
    ...state,
    loading: false,
    transactions: [],
  }),

  [TX_CREATION_PENDING]: state => ({
    ...state,
    creating: true,
  }),

  [TX_CREATION_SUCCESS]: (state, { payload: { txHash } }) => ({
    ...state,
    creating: false,
    createdTxHash: txHash,
  }),

  [TX_CREATION_ERROR]: state => ({
    ...state,
    creating: false,
  }),

  [TX_CREATE_NEW]: state => ({
    ...state,
    createdTxHash: null,
  }),
}

export default ReducerFactory(DState, Actions)
