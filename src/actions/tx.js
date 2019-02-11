import { scan, web3 } from '../config'
import {
  TX_FETCH_PENDING,
  TX_FETCH_SUCCESS,
  TX_FETCH_ERROR,
  TX_CREATION_PENDING,
  TX_CREATION_SUCCESS,
  TX_CREATION_ERROR,
  TX_CREATE_NEW,
  ACCOUNT_INCREMENT_NONCE,
} from '../constants/action'

export const fetchTransactions = () => async (dispatch, getState) => {
  dispatch({
    type: TX_FETCH_PENDING,
  })

  const selectedAccId = getState().account.selected
  const acc = getState().account.accounts[selectedAccId]
  const lastBlock = await web3.eth.getBlockNumber()

  try {
    const { result: txlist } = await scan.account.txlist(
      acc.address,
      lastBlock - 100000,
      'latest',
      'asc'
    )

    dispatch({
      type: TX_FETCH_SUCCESS,
      payload: {
        transactions: txlist.slice(-20).reverse(),
      },
    })
  } catch (err) {
    console.log(err)
    dispatch({
      type: TX_FETCH_ERROR,
    })
  }
}

export const sendTx = tx => async (dispatch, getState) => {
  dispatch({
    type: TX_CREATION_PENDING,
  })

  const selectedAccId = getState().account.selected
  const { privateKey } = getState().account.accounts[selectedAccId]
  const nonce = getState().account.nonces[selectedAccId]
  const acc = web3.eth.accounts.privateKeyToAccount(privateKey)

  const { rawTransaction } = await acc.signTransaction({
    ...tx,
    nonce,
    from: acc.address,
  })

  try {
    const txHash = await new Promise((resolve, reject) => {
      web3.eth
        .sendSignedTransaction(rawTransaction)
        .once('transactionHash', hash => resolve(hash))
        .once('error', error => reject(error))
    })

    dispatch({
      type: TX_CREATION_SUCCESS,
      payload: {
        txHash,
      },
    })

    dispatch({
      type: ACCOUNT_INCREMENT_NONCE,
      payload: {
        id: selectedAccId,
      },
    })
  } catch (err) {
    dispatch({
      type: TX_CREATION_ERROR,
    })
    console.log(err)
  }
}

export const createNewTx = () => dispatch =>
  dispatch({
    type: TX_CREATE_NEW,
  })
