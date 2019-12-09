import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

// Create a theme instance.
const theme = createMuiTheme({
  spacing: 4,
  palette: {
    primary: {
      main: '#232323',
    },
    secondary: {
      main: '#607d8b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f3f3f3',
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 12,
  },
});

export default theme;
