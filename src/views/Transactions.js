import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { withStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Receipt from '@material-ui/icons/ReceiptOutlined'
import RefreshIcon from '@material-ui/icons/Refresh'

import Screen from '../lib/screen'
import { compose } from '../lib/util'
import { fetchTransactions } from '../actions/tx'

const styleSheet = theme => ({
  wrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  transactions: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'auto',
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  listHeader: {
    padding: 15,
    display: 'flex',
  },
  txItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  hash: {
    maxWidth: 150,
  },
  txOut: {
    padding: '2px 5px',
    marginRight: 8,
    borderRadius: 5,
    backgroundColor: '#e67e22',
    color: '#fff',
  },
  txIn: {
    padding: '2px 5px',
    marginRight: 8,
    borderRadius: 5,
    backgroundColor: '#5cb85c',
    color: '#fff',
  },
  link: {
    color: '#3498db',
    '&:hover': {
      color: '#3498db',
    },
  },
  txStatus: {
    fontSize: 10,
  },
  txInfo: {
    display: 'flex',
    minWidth: 150,
  },
  button: {
    position: 'absolute',
    top: Screen.width < 600 ? -52 : -72,
    left: `calc(100% - ${Screen.width < 600 ? 52 : 72}px)`,
    width: Screen.width < 600 ? 36 : '',
    height: Screen.width < 600 ? 24 : '',
    margin: theme.spacing.unit,
  },
})

const TxList = ({ classes, transactions, account }) => (
  <div className={classes.transactions}>
    <List>
      {transactions.length < 1 && (
        <Typography variant="title" align="center">
          Транзакции не найдены
        </Typography>
      )}
      {transactions.map((tx, index) => {
        const isTxOut =
          account.address.toLowerCase() === tx.from.toLowerCase()
        return (
          <ListItem
            divider
            button
            key={index}
            className={classes.txItem}
          >
            <div>
              <div className={classes.txInfo}>
                {isTxOut ? (
                  <div className={classes.txOut}>
                    <Typography
                      className={classes.txStatus}
                      color="inherit"
                    >
                      OUT
                    </Typography>
                  </div>
                ) : (
                  <div className={classes.txIn}>
                    <Typography
                      className={classes.txStatus}
                      color="inherit"
                    >
                      IN
                    </Typography>
                  </div>
                )}
                <Typography noWrap>
                  {moment
                    .unix(Number.parseInt(tx.timeStamp, 10))
                    .fromNow()}
                </Typography>
              </div>
              {Screen.width < 600 && (
                <Typography noWrap className={classes.hash}>
                  <a
                    className={classes.link}
                    href={`https://ropsten.etherscan.io/address/${
                      isTxOut ? tx.to : tx.from
                    }`}
                    target="_blank"
                  >
                    {isTxOut ? tx.to : tx.from}
                  </a>
                </Typography>
              )}
            </div>
            {Screen.width >= 600 && (
              <Typography noWrap className={classes.hash}>
                <a
                  className={classes.link}
                  href={`https://ropsten.etherscan.io/address/${
                    isTxOut ? tx.to : tx.from
                  }`}
                  target="_blank"
                >
                  {isTxOut ? tx.to : tx.from}
                </a>
              </Typography>
            )}
            <Typography noWrap>
              {`${isTxOut ? '-' : '+'} ${BigNumber(tx.value)
                .dividedBy(10 ** 18)
                .toString()} Ether`}
            </Typography>
            <Typography noWrap className={classes.hash}>
              <a
                className={classes.link}
                href={`https://ropsten.etherscan.io/tx/${tx.hash}`}
                target="_blank"
              >
                <Receipt />
              </a>
            </Typography>
          </ListItem>
        )
      })}
    </List>
  </div>
)

class Transactions extends Component {
  componentDidMount() {
    this.props.fetchTransactions()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.account.address.toLowerCase() !==
      prevProps.account.address.toLowerCase()
    ) {
      this.props.fetchTransactions()
    }
  }

  render() {
    const {
      classes,
      loading,
      account,
      transactions,
      fetchTransactions,
    } = this.props
    return (
      <div className={classes.wrapper}>
        {loading ? (
          <div className={classes.loader}>
            <CircularProgress size={48} />
          </div>
        ) : (
          <TxList
            classes={classes}
            account={account}
            transactions={transactions}
          />
        )}
        <Button
          onClick={fetchTransactions}
          className={classes.button}
          variant="fab"
          color="primary"
        >
          <RefreshIcon />
        </Button>
      </div>
    )
  }
}

export default compose(
  withStyles(styleSheet),
  connect(
    state => ({
      loading: state.tx.loading,
      transactions: state.tx.transactions,
      account: state.account.accounts[state.account.selected],
    }),
    {
      fetchTransactions,
    }
  )
)(Transactions)
