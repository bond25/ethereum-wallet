import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'
import logger from 'redux-logger'

import RPersist from '../lib/redux-persist-state'
import reducers from '../reducers'

const { preloadedState, persistState } = RPersist([
  'account',
  'token',
])

const Store = createStore(
  combineReducers(reducers),
  preloadedState,
  applyMiddleware(logger, thunk, persistState)
)

export default Store
