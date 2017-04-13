//import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import PropTypes from 'prop-types';
//import { Router, Route, Switch } from 'react-router';

// Temporarily needed for Material UI
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
//

import App from './App';
import './index.css';
import './fixed-data-table.min.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
