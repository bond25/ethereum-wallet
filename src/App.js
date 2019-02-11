import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

import Wallet from './views/Wallet'
import NewAccount from './views/NewAccount'
import Screen from './lib/screen'
import { compose } from './lib/util'
import { loading } from './actions/app'
import { updateAccounts } from './actions/account'

const styleSheet = theme => ({
  root: {
    width: '100%',
    height: Screen.height,
    display: 'flex',
  },

  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  content: {
    width: '100%',
  },
})

class App extends Component {
  componentDidMount() {
    if (!this.props.isEmptyWallet) {
      this.props.updateAccounts()
    }
    this.props.startLoading()
    setTimeout(this.props.endLoading, 1000)
  }

  render() {
    const { classes, loading, isEmptyWallet } = this.props
    return (
      <div className={classes.root}>
        {loading ? (
          <div className={classes.loading}>
            <CircularProgress size={100} />
          </div>
        ) : (
          <Router>
            <Switch>
              <Route path="/new-account" component={NewAccount} />
              <Route
                path="/"
                render={props => {
                  return isEmptyWallet ? (
                    <Redirect to="/new-account" />
                  ) : (
                    <Wallet {...props} />
                  )
                }}
              />
            </Switch>
          </Router>
        )}
      </div>
    )
  }
}

export default compose(
  withStyles(styleSheet),
  connect(
    state => ({
      loading: state.app.loading,
      isEmptyWallet: state.account.accounts < 1,
    }),
    {
      startLoading: loading.start,
      endLoading: loading.end,
      updateAccounts,
    }
  )
)(App)
