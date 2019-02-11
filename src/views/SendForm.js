import React, { Component } from 'react'
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import { compose } from '../lib/util'
import Screen from '../lib/screen'
import { sendTx, createNewTx } from '../actions/tx'

const styleSheet = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit}px`,
  },
  textField: {
    marginBottom: theme.spacing.unit * 3,
  },
  total: {
    marginBottom: theme.spacing.unit * 3,
    color: '#09a042',
  },
  sendBtn: {
    backgroundColor: theme.palette.primaryBtn.main,
    color: theme.palette.primaryBtn.contrastText,

    '&:hover': {
      backgroundColor: theme.palette.primaryBtn.hover,
    },

    '&:visited, &:active': {
      backgroundColor: theme.palette.primaryBtn.visited,
    },
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  btnWrapper: {
    position: 'relative',
    width: '100%',
  },
  btnPorgress: {
    position: 'absolute',
    top: 'calc(50% - 12px)',
    left: 'calc(50% - 12px)',
  },
  fabProgress: {
    color: '#09a042',
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit,
    maxWidth: Screen.width < 600 ? 300 : 'none',
  },
  linkWrapper: {
    marginBottom: theme.spacing.unit * 2,
  },
  link: {
    color: theme.palette.link,
    '&:hover': {
      color: theme.palette.link,
    },
  },
  error: {
    color: theme.palette.err,
    fonSize: 14,
  },
})

const Result = ({ classes, txHash, onClick }) => (
  <div className={classes.result}>
    <Typography noWrap gutterBottom>
      <a
        className={classes.link}
        target="_blank"
        href={`https://ropsten.etherscan.io/tx/${txHash}`}
      >
        {txHash}
      </a>
    </Typography>
    <Button
      size="large"
      variant="contained"
      color="primary"
      onClick={onClick}
    >
      новый перевод
    </Button>
  </div>
)

class SendForm extends Component {
  state = {
    to: '',
    amount: '',
    gasPrice: '0.000000001',
    gasLimit: '21000',
    isDirty: true,
  }

  isValidForm = () => {
    const { to, amount, gasPrice } = this.state
    return /^0x[a-fA-F0-9]{40}$/.test(to) && amount && gasPrice
  }

  onInputChange = event => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (this.isValidForm()) {
          this.setState({
            isDirty: false,
          })
        } else {
          this.setState({
            isDirty: true,
          })
        }
      }
    )
  }

  onBtnClick = event => {
    event.preventDefault()
    this.props.sendTx({
      to: this.state.to,
      gasLimit: this.state.gasLimit,
      gasPrice: BigNumber(this.state.gasPrice)
        .multipliedBy(10 ** 18)
        .toString(),
      value: BigNumber(this.state.amount)
        .multipliedBy(10 ** 18)
        .toString(),
    })
  }

  getTotal = () => {
    const { amount, gasPrice, gasLimit } = this.state
    const total = BigNumber(amount)
      .plus(BigNumber(gasPrice).multipliedBy(gasLimit))
      .toString()
    return isNaN(total) ? '' : total
  }

  onCreateNewTxClick = () => {
    this.setState({
      to: '',
      amount: '',
      isDirty: true,
    })
    this.props.createNewTx()
  }

  isInsufficientFunds = () => {
    const { acc } = this.props
    return BigNumber(acc.balance).isLessThan(this.getTotal())
  }

  render() {
    const { classes, creating, createdTxHash } = this.props
    return createdTxHash ? (
      <Result
        classes={classes}
        txHash={createdTxHash}
        onClick={this.onCreateNewTxClick}
      />
    ) : (
      <form className={classes.form} onSubmit={this.onBtnClick}>
        {this.isInsufficientFunds() && (
          <Typography className={classes.error}>
            Недостаточно средств для перевода
          </Typography>
        )}
        <TextField
          required
          name="to"
          label="Адрес получателя"
          disabled={creating}
          className={classes.textField}
          value={this.state.to}
          onChange={this.onInputChange}
        />
        <TextField
          required
          name="amount"
          label="Количество"
          type="number"
          disabled={creating}
          className={classes.textField}
          value={this.state.amount}
          onChange={this.onInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">ETH</InputAdornment>
            ),
          }}
        />
        <TextField
          required
          name="gasPrice"
          label="Цена газа"
          type="number"
          disabled={creating}
          className={classes.textField}
          value={this.state.gasPrice}
          onChange={this.onInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">ETH</InputAdornment>
            ),
          }}
        />
        <Typography
          className={classes.total}
          variant="title"
        >{`Total: ${this.getTotal()}`}</Typography>
        <div className={classes.btnWrapper}>
          <Button
            fullWidth
            className={classes.sendBtn}
            type="submit"
            variant="contained"
            disabled={
              this.state.isDirty ||
              creating ||
              this.isInsufficientFunds()
            }
          >
            Отправить
          </Button>
          {creating && (
            <CircularProgress
              size={24}
              className={classes.btnPorgress}
            />
          )}
        </div>
      </form>
    )
  }
}

export default compose(
  withStyles(styleSheet),
  connect(
    state => ({
      acc: state.account.accounts[state.account.selected],
      creating: state.tx.creating,
      createdTxHash: state.tx.createdTxHash,
    }),
    {
      sendTx,
      createNewTx,
    }
  )
)(SendForm)
