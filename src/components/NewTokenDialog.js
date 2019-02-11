import React from 'react'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'

const styleSheet = theme => ({
  paper: {
    backgroundColor: theme.palette.white,
  },
})

const NewTokenDialog = ({
  classes,
  open,
  onClose,
  onAdd,
  onInputChange,
}) => (
  <Dialog open={open} onClose={onClose} fullWidth classes={classes}>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Адрес контракта"
        type="contract"
        onChange={onInputChange}
        fullWidth
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Отменить
      </Button>
      <Button onClick={onAdd} color="primary">
        Добавить
      </Button>
    </DialogActions>
  </Dialog>
)

export default withStyles(styleSheet)(NewTokenDialog)
