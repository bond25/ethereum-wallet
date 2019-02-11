import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

import { compose } from '../lib/util'
import { createAccount } from '../actions/account'

const styleSheet = {
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  btnProgress: {
    position: 'absolute',
    top: 'calc(50% - 12px)',
    left: 'calc(50% - 12px)',
  },
}

class NewAccount extends Component {
  timer = null

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  onAccountCreate = async () => {
    const { history, createAccount } = this.props
    await createAccount()
    history.push('/')
  }

  render() {
    const { classes, creating } = this.props
    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Button
            size="large"
            variant="contained"
            color="primary"
            disabled={creating}
            onClick={this.onAccountCreate}
          >
            создать аккаунт
          </Button>
          {creating && (
            <CircularProgress
              size={24}
              className={classes.btnProgress}
            />
          )}
        </div>
      </div>
    )
  }
}

export default compose(
  withStyles(styleSheet),
  connect(
    state => ({
      creating: state.account.creating,
    }),
    {
      createAccount,
    }
  )
)(NewAccount)
