import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  palette: {
    primary: {
      main: '#0E3464',
      dark: '#0e3566',
    },
    primaryBtn: {
      main: 'rgba(240, 50, 38, 0.85)',
      hover: 'rgba(240, 50, 38, 1)',
      visited: 'rgba(158, 12, 0, 1)',
      contrastText: '#fff',
    },
    err: '#EF3124',
    link: '#3498db',
    background: '#F3F4F5',
    white: '#fff',
  },
})
