import { ReducerFactory } from '../lib/util'
import { APP_LOADING_START, APP_LOADING_END } from '../constants/action'

const DState = {
  loading: false,
}

const Actions = {
  [APP_LOADING_START]: state => ({
    ...state,
    loading: true,
  }),

  [APP_LOADING_END]: state => ({
    ...state,
    loading: false,
  }),
}

export default ReducerFactory(DState, Actions)
