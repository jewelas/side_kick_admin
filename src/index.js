import React from 'react';
import ReactDOM from 'react-dom';
import MuiTheme from './theme';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalStateStore } from './DAppComponents/Utility/GloabalStateStore';
import { ThemeProvider } from '@material-ui/core';

ReactDOM.render(
  // <React.StrictMode>
    <Router>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStateStore>
          <App />
        </GlobalStateStore>
      </ThemeProvider>
    </Router>
  // </React.StrictMode>
  , document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
