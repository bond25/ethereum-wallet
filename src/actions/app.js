import { APP_LOADING_START, APP_LOADING_END } from '../constants/action'

export const loading = {
  start() {
    return {
      type: APP_LOADING_START,
    }
  },

  end() {
    return {
      type: APP_LOADING_END,
    }
  },
}
