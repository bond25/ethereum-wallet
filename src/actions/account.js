import BigNumber from 'bignumber.js'
import { web3, scan } from '../config'
import {
  ACCOUNT_CREATION_PENDING,
  ACCOUNT_CREATION_SUCCESS,
  ACCOUNT_SET_SELECTED,
  ACCOUNT_SET_ACCOUNTS,
  ACCOUNT_UPDATE_NONCE,
  ACCOUNT_SET_NONCE,
} from '../constants/action'

export const createAccount = () => async (dispatch, getState) => {
  dispatch({
    type: ACCOUNT_CREATION_PENDING,
  })

  const account = web3.eth.accounts.create()

  try {
    const [balance, price] = await Promise.all([
      web3.eth.getBalance(account.address),
      scan.stats.ethprice(),
    ])
    const usdBalance = BigNumber(balance)
      .multipliedBy(BigNumber(price.result.ethusd))
      .decimalPlaces(2)
      .toString()

    dispatch({
      type: ACCOUNT_CREATION_SUCCESS,
      payload: {
        account: {
          ...account,
          balance,
          usdBalance,
        },
      },
    })

    //created acc id
    const id = getState().account.accounts.length - 1

    dispatch({
      type: ACCOUNT_SET_SELECTED,
      payload: {
        id,
      },
    })
  } catch (err) {
    console.error(err)
  }
}

export const changeAccount = id => async dispatch => {
  dispatch({
    type: ACCOUNT_SET_SELECTED,
    payload: {
      id,
    },
  })
}

export const updateAccounts = () => async (dispatch, getState) => {
  const accounts = getState().account.accounts

  try {
    const promises = accounts.map(acc =>
      web3.eth.getBalance(acc.address)
    )
    const [price, ...balances] = await Promise.all([
      scan.stats.ethprice(),
      ...promises,
    ])
    const updatedAccs = accounts.map((acc, index) => {
      const eth = web3.utils.fromWei(balances[index], 'ether')
      return {
        ...acc,
        balance: eth,
        usdBalance: BigNumber(eth)
          .multipliedBy(BigNumber(price.result.ethusd))
          .decimalPlaces(2)
          .toString(),
      }
    })

    dispatch({
      type: ACCOUNT_SET_ACCOUNTS,
      payload: {
        accounts: updatedAccs,
      },
    })

    const selectedAccId = getState().account.selected
    dispatch({
      type: ACCOUNT_SET_SELECTED,
      payload: {
        id: selectedAccId,
      },
    })
  } catch (err) {
    console.log(err)
  }
}

export const getSelectedAccountNonce = () => async (
  dispatch,
  getState
) => {
  const selectedAccId = getState().account.selected
  const { address } = getState().account.accounts[selectedAccId]
  const Nonce = getState().account.nonces[selectedAccId]
  const nonce = await web3.eth.getTransactionCount(address)

  if (nonce > Nonce)
    dispatch({
      type: ACCOUNT_SET_NONCE,
      payload: {
        nonce,
        id: selectedAccId,
      },
    })
}

export const updateNonce = () => async (dispatch, getState) => {
  const selectedAccId = getState().account.selected
  const { address } = getState().account.accounts[selectedAccId]
  const Nonce = getState().account.nonces[selectedAccId]
  const nonce = await web3.eth.getTransactionCount(address)
  if (nonce > Nonce)
    dispatch({
      type: ACCOUNT_UPDATE_NONCE,
      payload: {
        nonce,
        id: selectedAccId,
      },
    })
}
