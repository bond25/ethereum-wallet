import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import RefreshIcon from '@material-ui/icons/Refresh'
import CircularProgress from '@material-ui/core/CircularProgress'

import TokenList from '../components/TokenList'
import NewTokenDialog from '../components/NewTokenDialog'
import { compose } from '../lib/util'
import Screen from '../lib/screen'
import {
  fetchToken,
  fetchTokens,
  removeToken,
} from '../actions/token'

const styleSheet = theme => ({
  tokens: {
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  controls: {
    display: 'flex',
    position: 'absolute',
    top: Screen.width < 600 ? -52 : -72,
    left: `calc(100% - ${Screen.width < 600 ? 104 : 144}px)`,
  },
  button: {
    width: Screen.width < 600 ? 36 : '',
    height: Screen.width < 600 ? 24 : '',
    margin: theme.spacing.unit,
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
})

export class Tokens extends Component {
  static propTypes = {}

  state = {
    open: false,
    contract: '',
  }

  componentDidMount() {
    this.refetchTokens()
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.account.address.toLowerCase() !==
      prevProps.account.address.toLowerCase()
    ) {
      this.refetchTokens()
    }
  }

  refetchTokens = () => {
    const { account, tokens } = this.props
    this.props.fetchTokens(account.address, tokens)
  }

  onDialogOpen = () => this.setState({ open: true })
  onDialogClose = () => this.setState({ open: false })

  onNewTokenAdd = () => {
    const { account } = this.props
    this.props.fetchToken(account.address, this.state.contract)
    this.onDialogClose()
  }

  onTokenRemove = index => {
    const { account } = this.props
    this.props.removeToken(account.address, index)
  }

  onInputChange = event =>
    this.setState({ contract: event.target.value })

  render() {
    const { classes, loading, tokens } = this.props
    return (
      <Fragment>
        <div className={classes.tokens}>
          {loading ? (
            <div className={classes.loader}>
              <CircularProgress size={48} />
            </div>
          ) : (
            <TokenList
              tokens={tokens}
              onCardRemove={this.onTokenRemove}
            />
          )}
          <div className={classes.controls}>
            <Button
              onClick={this.onDialogOpen}
              className={classes.button}
              variant="fab"
              color="primary"
            >
              <AddIcon />
            </Button>
            <Button
              onClick={this.refetchTokens}
              className={classes.button}
              variant="fab"
              color="primary"
            >
              <RefreshIcon />
            </Button>
          </div>
        </div>
        <NewTokenDialog
          open={this.state.open}
          onClose={this.onDialogClose}
          onAdd={this.onNewTokenAdd}
          onInputChange={this.onInputChange}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  const accIndex = state.account.selected
  const acc = state.account.accounts[accIndex]
  return {
    account: acc,
    loading: state.token.loading,
    tokens: state.token.tokens[acc.address] || [],
  }
}

const mapDispatchToProps = {
  fetchToken,
  fetchTokens,
  removeToken,
}

export default compose(
  withStyles(styleSheet),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Tokens)
