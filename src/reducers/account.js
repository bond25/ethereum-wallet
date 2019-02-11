import { ReducerFactory } from '../lib/util'
import {
  ACCOUNT_CREATION_PENDING,
  ACCOUNT_CREATION_SUCCESS,
  ACCOUNT_SET_SELECTED,
  ACCOUNT_SET_ACCOUNTS,
  ACCOUNT_UPDATE_NONCE,
  ACCOUNT_SET_NONCE,
  ACCOUNT_INCREMENT_NONCE,
} from '../constants/action'

const DState = {
  accounts: [],
  selected: null,
  creating: false,
  nonces: [],
}

const Actions = {
  [ACCOUNT_CREATION_PENDING]: state => ({ ...state, creating: true }),

  [ACCOUNT_CREATION_SUCCESS]: (state, { payload: { account } }) => ({
    ...state,
    accounts: [...state.accounts, account],
    nonces: [...state.nonces, 0],
    creating: false,
  }),

  [ACCOUNT_SET_SELECTED]: (state, { payload: { id } }) => ({
    ...state,
    selected: id,
  }),

  [ACCOUNT_SET_ACCOUNTS]: (state, { payload: { accounts } }) => ({
    ...state,
    accounts,
  }),

  [ACCOUNT_UPDATE_NONCE]: (state, { payload: { id, nonce } }) => ({
    ...state,
    nonces: [
      ...state.nonces.slice(0, id),
      nonce,
      ...state.nonces.slice(id + 1),
    ],
  }),

  [ACCOUNT_SET_NONCE]: (state, { payload: { id, nonce } }) => ({
    ...state,
    nonces: [
      ...state.nonces.slice(0, id),
      nonce,
      ...state.nonces.slice(id + 1),
    ],
  }),

  [ACCOUNT_INCREMENT_NONCE]: (state, { payload: { id } }) => ({
    ...state,
    nonces: [
      ...state.nonces.slice(0, id),
      state.nonces[id] + 1,
      ...state.nonces.slice(id + 1),
    ],
  }),
}

export default ReducerFactory(DState, Actions)
