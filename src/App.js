import React, { PropTypes, Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './App.css';

// Components.
import ContactDialog from './components/ContactsDialog';
import ContactsTable from './components/ContactsTable';

/* DEMO Redux */
import todoApp from './reducers'
//import AddTodo from './containers/AddTodo'
import VisibleTodoList from './containers/VisibleTodoList'
/* /DEMO Redux */

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#464646',
    primary1Color: '#676767',
    accent1Color: '#216fb5',
    alternateTextColor: '#fff',
  },
  fontFamily: 'Helvetica Neue, Lato, sans-serif',
});

/*<div className="ck-content">            
  <VisibleTodoList />
</div>*/

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="ck-container">
          <h1 className="ck-h1">Contacts Keeper</h1>

          <div className="ck-content">
            <ContactDialog />
            <div className="ck-container">
              <ContactsTable />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
