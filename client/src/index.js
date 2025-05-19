import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import './index.css';
import App from './App';
import store from "./redux/store";
import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
</Provider>
);
