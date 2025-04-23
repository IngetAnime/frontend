import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import { createTheme, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536, // optional: bisa abaikan jika tidak butuh
    },
  },
  palette: {
    primary: {
      main: '#00BC7D',
      contrastText: '#FFF',
    },
    secondary: {
      main: '#FB2C36',
      contrastText: '#FFF'
    }
    // secondary: {
    //   light: '#ff7961',
    //   main: '#f44336',
    //   dark: '#ba000d',
    //   contrastText: '#000',
    // },
  },
  typography: {
    h1: {
      fontSize: '1rem',
      fontWeight: 600
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600
    }
  },
  components: {
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 0,
          paddingBottom: 0,
          margin: 0
        }
      }
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
        color: 'primary',
      },
      styleOverrides: {
        root: {
          cursor: 'pointer',
        },
      },
    },
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <App />
        <ToastContainer />
      </AppContextProvider>
    </ThemeProvider>
  </StrictMode>,
)