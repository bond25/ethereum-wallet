import React from 'react'
import { withStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import Screen from '../lib/screen'

const styleSheet = {
  list: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
  },
  card: {
    width: '100%',
    display: 'flex',
    flexDirection: Screen.width < 600 ? 'column' : 'flex',
    justifyContent: 'space-between',
  },
}

const TokenCell = ({ classes, label, value }) => (
  <div className="tokenProp">
    <Typography variant="caption">{label}</Typography>
    <Typography>{value}</Typography>
  </div>
)

const TokenList = ({ classes, tokens, onCardRemove }) => (
  <div className={classes.list}>
    <List>
      {!tokens.length ? (
        <Typography variant="title" align="center">
          Список токенов пуст
        </Typography>
      ) : (
        tokens.map((token, index) => (
          <ListItem divider button key={index}>
            <div className={classes.card}>
              <TokenCell
                value={`${token.name} (${token.symbol})`}
                label="Name"
              />
              <TokenCell value={token.balance} label="Balance" />
              <TokenCell value={token.supply} label="Supply" />
            </div>
            <IconButton
              color="secondary"
              onClick={() => onCardRemove(index)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))
      )}
    </List>
  </div>
)

export default withStyles(styleSheet)(TokenList)
