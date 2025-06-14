import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#275559' ,
    },
    secondary: {
      main: '#9EDC29', 
    },
    error: {
      main: '#d32f2f', // red color
    },
  },
});

export default theme;