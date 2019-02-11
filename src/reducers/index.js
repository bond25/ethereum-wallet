import AppReducer from './app'
import AccountReducer from './account'
import TxReducer from './tx'
import TokenReducer from './token'

export default {
  app: AppReducer,
  account: AccountReducer,
  tx: TxReducer,
  token: TokenReducer,
}
