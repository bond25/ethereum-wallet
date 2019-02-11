import Web3 from 'web3'
import Etherscan from '../lib/etherscan-api'
import tokenABI from '../contracts/token'

const {
  REACT_APP_INFURA_URL = '',
  REACT_APP_ETHERSCAN_KEY = '',
} = process.env

const web3 = new Web3(REACT_APP_INFURA_URL)
const scan = Etherscan.init(REACT_APP_ETHERSCAN_KEY, 'ropsten')

const tokenMethods = address =>
  new web3.eth.Contract(tokenABI, address).methods

export { web3, scan, tokenMethods }
