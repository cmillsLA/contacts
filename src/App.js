import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import IconNavCancelCircle from 'material-ui/svg-icons/navigation/cancel';
import {Table, Column, Cell} from 'fixed-data-table';
import './App.css';

/* Demo */
var FakeObjectDataListStore = require('./FakeObjectDataListStore');
/* /Demo */

/* Form */
import TextField from 'material-ui/TextField';
/* Form */

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#464646',
    primary1Color: '#676767',
    accent1Color: '#216fb5',
    alternateTextColor: '#fff',
  },
  fontFamily: 'Helvetica Neue, Lato, sans-serif',
});

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    var {sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    );
  }

  _onSortChange(e) {
    e.preventDefault();

    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
}

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    {data.getObjectAt(rowIndex)[columnKey]}
  </Cell>
);

class DataListWrapper {
  constructor(indexMap, data) {
    this._indexMap = indexMap;
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this._data.getObjectAt(
      this._indexMap[index],
    );
  }
}

class SortExample extends React.Component {
  constructor(props) {
    super(props);

    this._dataList = new FakeObjectDataListStore(10);

    this._defaultSortIndexes = [];
    var size = this._dataList.getSize();
    for (var index = 0; index < size; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.state = {
      sortedDataList: this._dataList,
      colSortDirs: {},
    };

    this.ckTableWidth = window.offsetWidth - 80;

    this._onSortChange = this._onSortChange.bind(this);
  }

  _onSortChange(columnKey, sortDir) {
    var sortIndexes = this._defaultSortIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      var valueA = this._dataList.getObjectAt(indexA)[columnKey];
      var valueB = this._dataList.getObjectAt(indexB)[columnKey];
      var sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = sortVal * -1;
      }

      return sortVal;
    });

    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  _getWindowWidth() {
    return window.innerWidth - 80;
  }

  render() {
    var {sortedDataList, colSortDirs} = this.state;
    return (
      <Table
        rowHeight={50}
        rowsCount={sortedDataList.getSize()}
        headerHeight={50}
        width={this._getWindowWidth()}
        height={500}
        {...this.props}>
        <Column
          columnKey="id"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.id}>
              id
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
          fixed={true}
        />
        <Column
          columnKey="firstName"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.firstName}>
              First Name
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
          flexGrow={2}
        />
        <Column
          columnKey="lastName"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.lastName}>
              Last Name
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
          flexGrow={1}
        />
        <Column
          columnKey="city"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.city}>
              City
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
        />
        <Column
          columnKey="companyName"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.companyName}>
              Company Name
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={200}
        />
      </Table>
    );
  }
}

const styles = {
  errorStyle: {
    color: '#f58025',
  },
  underlineStyle: {
    borderColor: '#fff',
    bottom: '16px'
  },
  underlineStyleTextarea: {
    borderColor: '#fff',
    bottom: '5px'
  },
  underlineFocusStyle: {
    borderColor: '#f58025'
  },
  hintStyles: {
    bottom:'28px',
    left: '5px'
  },
};

class NewContactForm extends React.Component {
  render() {
    return(
      <div>
        <form className="ck-form-contacts">
          <div className="ck-row">
            <div className="ck-row-half">
              <TextField
                floatingLabelText="First Name"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
              />
            </div>
            <div className="ck-row-half">
              <TextField
                floatingLabelText="Last Name"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
              />
            </div>
          </div>
          <div className="ck-row">
            <div className="ck-row-half">
              <TextField
                floatingLabelText="Date of Birth"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                hintText="MM-DD-YYYY"
                hintStyle={styles.hintStyles}
              />
            </div>
            <div className="ck-row-half">
              <TextField
                floatingLabelText="Phone Number"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                hintText="555-555-5555"
                hintStyle={styles.hintStyles}
              />
            </div>
          </div>
          <div className="ck-row">
            <div className="ck-row-half">
              <TextField
                floatingLabelText="Email"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
              />
            </div>
          </div>
          <div className="ck-row">
            <TextField
              floatingLabelText="Notes"
              floatingLabelFixed={true}
              multiLine={true}
              rows={3}
              rowsMax={5}
              className="ck-input-text ck-input-textarea"
              underlineStyle={styles.underlineStyleTextarea}
              underlineFocusStyle={styles.underlineFocusStyle}
            />
          </div>
        </form>
      </div>
    )
  }
}         

class NewContact extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    console.log('open');
    this.setState({open: true});
  };

  handleClose = () => {
    console.log('closed');
    this.setState({open: false});
  };

  render() {
    const actions = [
      <FlatButton
        onTouchTap={this.handleClose}
        icon={<IconNavCancelCircle />}
        className="ck-dialog-cancel"
      />,
      <RaisedButton
        label="Save"
        primary={true}
        //disabled={true}
        onTouchTap={this.handleClose}
        className="ck-clear-uppercase"
      />,
    ];

    return (
      <div>
        <div className="ck-row ck-mb20">
          <div className="ck-row-half ck-align-left">Search Bar</div>
          <div className="ck-row-half ck-align-right">
            <RaisedButton
              label="Contacts Keeper"
              secondary={true}
              onTouchTap={this.handleOpen}
              icon={<IconContentAddCircle />}
              className="ck-clear-uppercase ck-btn-dialog"
            />
          </div>
        </div>
        <Dialog
          title="Contacts Keeper"
          actions={actions}
          modal={true}
          open={this.state.open}
          autoScrollBodyContent={true}
          titleClassName="ck-dialog-header"
        >
          <NewContactForm />
        </Dialog>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="ck-container">
          <h1 className="ck-h1">Contacts Keeper</h1>
          <div className="ck-content">
            <NewContact />
            <div className="ck-container">
              <SortExample />
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
