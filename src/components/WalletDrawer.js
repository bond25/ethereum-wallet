import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import BigNumber from 'bignumber.js'

import Screen from '../lib/screen'

const styleSheet = theme => ({
  drawer: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  drawerCross: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '10px',
  },
  cross: {
    color: theme.palette.white,
  },
  accountList: {
    width: Screen.width < 380 ? Screen.width : 'auto',
    height: `calc(${Screen.height}px - 68px - 56px)`,
    overflowY: 'auto',
  },
  accountItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: 'auto',
    color: theme.palette.white,
  },
  selectedAccount: {
    backgroundColor: theme.palette.primary.dark,
  },
  accAddress: {
    maxWidth: Screen.width < 600 ? 300 : 'auto',
  },
  accInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  nav: {
    backgroundColor: theme.palette.white,
  },
})

const AccountList = ({
  classes,
  account,
  accounts,
  onAccountSelect,
}) => (
  <div className={classes.accountList}>
    <MenuList>
      {accounts.map((acc, index) => (
        <MenuItem
          classes={{
            root: classes.accountItem,
            selected: classes.selectedAccount,
          }}
          selected={account.address === acc.address}
          key={index}
          onClick={() => onAccountSelect(index)}
        >
          <div className={classes.accInfo}>
            <Typography noWrap color="inherit">
              {`Аккаунт ${index + 1}`}
            </Typography>
            <Typography color="inherit">{`${BigNumber(acc.balance)
              .decimalPlaces(8)
              .toString()} ETH`}</Typography>
          </div>
          <Typography
            className={classes.accAddress}
            color="inherit"
            noWrap
          >
            {acc.address}
          </Typography>
        </MenuItem>
      ))}
    </MenuList>
  </div>
)

AccountList.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  onAccountSelect: PropTypes.func.isRequired,
}

const Navigation = ({ classes }) => (
  <BottomNavigation showLabels className={classes.nav}>
    <BottomNavigationAction
      label="Создать"
      to="/new-account"
      component={Link}
    />
  </BottomNavigation>
)

const WalletDrawer = ({
  classes,
  account,
  accounts,
  open,
  onClose,
  onAccountSelect,
}) => (
  <Drawer
    classes={{
      paper: classes.drawer,
    }}
    open={open}
    onClose={onClose}
  >
    <div className={classes.drawerCross}>
      <IconButton
        className={classes.cross}
        onClick={onClose}
        aria-label="Close"
      >
        <CloseIcon />
      </IconButton>
    </div>
    <AccountList
      onAccountSelect={onAccountSelect}
      classes={classes}
      accounts={accounts}
      account={account}
    />
    <Navigation classes={classes} />
  </Drawer>
)

WalletDrawer.propTypes = {
  account: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccountSelect: PropTypes.func.isRequired,
}

export default withStyles(styleSheet)(WalletDrawer)
