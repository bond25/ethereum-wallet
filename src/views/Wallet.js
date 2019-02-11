import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Screen from '../lib/screen'
import { compose } from '../lib/util'

import {
  changeAccount,
  updateAccounts,
  getSelectedAccountNonce,
  updateNonce,
} from '../actions/account'
import AccountDetails from '../components/AccountDetails'
import WalletDrawer from '../components/WalletDrawer'
import Transactions from '../views/Transactions'
import SendForm from '../views/SendForm'
import Tokens from '../views/Tokens'

const styleSheet = theme => ({
  wallet: {
    width: '100%',
  },
  appBar: {
    height: 60,
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  navAction: {
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    height: `calc(${Screen.height}px - ${
      Screen.width <= 600 ? 116 : 160
    }px - 60px - 60px)`,
  },
})

const Bar = ({ classes, onMenuClick }) => (
  <AppBar position="static" className={classes.appBar}>
    <Toolbar>
      <IconButton
        color="inherit"
        aria-label="Menu"
        onClick={onMenuClick}
      >
        <MenuIcon />
      </IconButton>
    </Toolbar>
  </AppBar>
)

Bar.propTypes = {
  classes: PropTypes.object.isRequired,
  onMenuClick: PropTypes.func.isRequired,
}

const Navigation = ({ classes, value, onChange }) => (
  <Tabs className={classes.nav} value={value} onChange={onChange}>
    <Tab component={Link} to="/" label="Операции" value="/" />
    <Tab component={Link} to="/token" label="Токены" value="/token" />
    <Tab
      component={Link}
      to="/send"
      label="Отправить"
      value="/send"
    />
  </Tabs>
)

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

class Wallet extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  timers = []

  state = {
    selected: this.props.location.pathname || '/',
    open: false,
  }

  componentDidMount() {
    this.props.getSelectedAccountNonce()
    this.timers.push(
      setInterval(this.props.updateAccounts, 20 * 1000)
    )
    this.timers.push(setInterval(this.props.updateNonce, 3 * 1000))
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.account.address.toLowerCase() !==
      prevProps.account.address.toLowerCase()
    ) {
      this.props.getSelectedAccountNonce()
    }
  }

  componentWillUnmount() {
    this.timers.forEach(t => clearInterval(t))
  }

  onTabChange = (event, value) => {
    this.setState({
      selected: value,
    })
  }

  onDrawerOpen = () =>
    this.setState({
      open: true,
    })

  onDrawerClose = () =>
    this.setState({
      open: false,
    })

  onAccountSelect = id => {
    this.props.changeAccount(id)
    this.onDrawerClose()
  }

  render() {
    const { classes, accounts, account } = this.props
    return (
      <div className={classes.wallet}>
        <WalletDrawer
          account={account}
          accounts={accounts}
          open={this.state.open}
          onClose={this.onDrawerClose}
          onAccountSelect={this.onAccountSelect}
        />
        <Bar classes={classes} onMenuClick={this.onDrawerOpen} />
        <AccountDetails account={account} />
        <div className={classes.content}>
          <Switch>
            <Route exact path="/" component={Transactions} />
            <Route exact path="/token" component={Tokens} />
            <Route path="/send" component={SendForm} />
          </Switch>
        </div>
        <Navigation
          classes={classes}
          value={this.state.selected}
          onChange={this.onTabChange}
        />
      </div>
    )
  }
}

export default compose(
  withStyles(styleSheet),
  connect(
    state => ({
      accounts: state.account.accounts,
      account: state.account.accounts[state.account.selected],
      selectedAccId: state.account.selected,
    }),
    {
      changeAccount,
      updateAccounts,
      updateNonce,
      getSelectedAccountNonce,
    }
  )
)(Wallet)
