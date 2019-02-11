import { tokenMethods } from '../config'
import {
  TOKEN_FETCH_PENDING,
  TOKEN_FETCH_SUCCESS,
  TOKEN_REMOVE,
  TOKENS_FETCH_PENDING,
  TOKENS_FETCH_SUCCESS,
} from '../constants/action'

const fetchTokenInfo = async (accAddr, contract) => {
  const methods = tokenMethods(contract)

  try {
    const [name, symbol, supply, balance] = await Promise.all([
      methods['name']().call({ from: accAddr }),
      methods['symbol']().call({ from: accAddr }),
      methods['totalSupply']().call({ from: accAddr }),
      methods['balanceOf'](accAddr).call({ from: accAddr }),
    ])
    return {
      name,
      symbol,
      supply,
      balance,
      contract,
    }
  } catch (e) {
    console.log(e)
  }
}

export const fetchToken = (accAddr, contract) => async dispatch => {
  dispatch({
    type: TOKEN_FETCH_PENDING,
  })

  try {
    const token = await fetchTokenInfo(accAddr, contract)
    dispatch({
      type: TOKEN_FETCH_SUCCESS,
      accAddr,
      token,
    })
  } catch (e) {
    console.log(e)
  }
}

export const removeToken = (accAddr, index) => ({
  type: TOKEN_REMOVE,
  accAddr,
  index,
})

export const fetchTokens = (accAddr, tokens) => async dispatch => {
  dispatch({
    type: TOKENS_FETCH_PENDING,
  })

  try {
    const updTokens = await Promise.all(
      tokens.map(t => fetchTokenInfo(accAddr, t.contract))
    )
    dispatch({
      type: TOKENS_FETCH_SUCCESS,
      tokens: updTokens,
      accAddr,
    })
  } catch (e) {
    console.log(e)
  }
}
