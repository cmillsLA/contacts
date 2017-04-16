import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import './styles/App.css';

// Components.
import ContactsDialog from './components/ContactsDialog/ContactsDialog';
import ContactsTable from './components/ContactsTable/ContactsTable';

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#464646',
    primary1Color: '#676767',
    accent1Color: '#216fb5',
    alternateTextColor: '#fff',
  },
  fontFamily: 'Helvetica Neue, Lato, sans-serif',
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="ck-container">
          <h1 className="ck-h1">Contacts Keeper</h1>
          <div className="ck-content">
            <ContactsDialog />
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
