import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import QRCode from 'qrcode.react'

import Screen from '../lib/screen'

const styleSheet = theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    height: '80',
    backgroundColor: '#F3F4F5',
  },
  info: {
    display: 'flex',
  },
  content: {
    padding: theme.spacing.unit,
  },
  address: {
    padding: Screen.width < 600 ? theme.spacing.unit : 0,
    fontSize: Screen.width < 600 ? 14 : 18,
  },
  balance: {
    width: '100%',
    padding: theme.spacing.unit,
  },
  ethBalance: {
    fontSize: Screen.width < 600 ? 18 : 32,
  },
  usdBalance: {
    fontSize: Screen.width < 600 ? 14 : 18,
  },
})

const AccountDetails = ({ classes, account }) => (
  <div className={classes.card}>
    {Screen.width < 600 && (
      <Typography noWrap className={classes.address} align="center">
        {account.address}
      </Typography>
    )}
    <div className={classes.info}>
      <QRCode
        size={Screen.width < 600 ? 80 : 160}
        value={account.address}
      />
      <div className={classes.balance}>
        {!(Screen.width < 600) && (
          <Typography noWrap className={classes.address} align="left">
            {account.address}
          </Typography>
        )}
        <Typography className={classes.ethBalance}>{`${
          account.balance
        } ETH`}</Typography>
        <Typography className={classes.usdBalance}>{`$${
          account.usdBalance
        }`}</Typography>
      </div>
    </div>
  </div>
)

AccountDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
}

export default withStyles(styleSheet)(AccountDetails)
