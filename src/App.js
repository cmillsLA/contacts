import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import IconNavCancelCircle from 'material-ui/svg-icons/navigation/cancel';
import IconSearch from 'material-ui/svg-icons/action/search';
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

// Table.
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

function _ckColumnName(name) {
  return name.replace(/([A-Z])/g, ' $1').trim();
}

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    <span className="ck-responsive-th">{_ckColumnName(columnKey)}</span>
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

const tablestyles = {
  errorStyle: {
    color: '#f58025',
  },
  underlineStyle: {
    borderColor: '#fff',
    bottom: '6px',
    left: '6px',
  },
  underlineStyleTextarea: {
    borderColor: '#fff',
    bottom: '5px',
  },
  underlineFocusStyle: {
    borderColor: '#f58025'
  },
  hintStyles: {
    bottom:'17px',
    left: '8px',
  },
};

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
      tableWidth  : 1000,
      tableHeight : 500,
      filterval: ''
    };

    this.ckTableWidth = window.offsetWidth - 80;

    this._onSortChange = this._onSortChange.bind(this);
    this._update = this._update.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFilterSubmit = this._onFilterSubmit.bind(this);
    this._onBlurChange = this._onBlurChange.bind(this);
  }

  componentDidMount() {
    var win = window;
    if (win.addEventListener) {
      win.addEventListener('resize', this._update, false);
    } else if (win.attachEvent) {
      win.attachEvent('onresize', this._update);
    } else {
      win.onresize = this._update;
    }
    this._update();
  }

  componentWillReceiveProps(props) {
    this._update();
  }

  componentWillUnmount() {
    var win = window;
    if(win.removeEventListener) {
      win.removeEventListener('resize', this._update, false);
    } else if(win.removeEvent) {
      win.removeEvent('onresize', this._update, false);
    } else {
      win.onresize = null;
    }
  }

  _onFilterChange(e) {
    this.setState({
      filterval: e.target.value,
    });
  }

  _onBlurChange(e) {
    if(!e.target.value) {
      this.setState({
        sortedDataList: this._dataList,
      });
    }
  }

  _onFilterSubmit(e) {
    e.preventDefault();
    if (!this.state.filterval) {
      this.setState({
        sortedDataList: this._dataList,
      });
    }
    var filterBy = this.state.filterval.toLowerCase();
    var size = this._dataList.getSize();
    var filteredIndexes = [];
    var filterFound = (firstName, lastName, email) => {
      return firstName.toLowerCase().indexOf(filterBy) !== -1 ||
      lastName.toLowerCase().indexOf(filterBy) !== -1 ||
      email.toLowerCase().indexOf(filterBy) !== -1
    };
    for (var index = 0; index < size; index++) {
      var {firstName} = this._dataList.getObjectAt(index);
      var {lastName} = this._dataList.getObjectAt(index);
      var {email} = this._dataList.getObjectAt(index);
      if (filterFound(firstName, lastName, email)) {
        filteredIndexes.push(index);
      }
    }

    this.setState({
      sortedDataList: new DataListWrapper(filteredIndexes, this._dataList),
    });

  }

  _update() {
    this.setState({
      tableWidth  : window.innerWidth - 80
    });
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

  render() {
    var {sortedDataList, colSortDirs} = this.state;
    return (
      <div>
        <div className="ck-table-filter ck-align-left ck-mb10">
          <form onSubmit={this._onFilterSubmit}>
            <TextField
                className="ck-input-text ck-table-filter-input ck-inline"
                underlineStyle={tablestyles.underlineStyle}
                underlineFocusStyle={tablestyles.underlineFocusStyle}
                hintText="Search by First Name, Last Name, or Email"
                hintStyle={tablestyles.hintStyles}
                value={this.state.filterval}
                onChange={this._onFilterChange}
                onBlur={this._onBlurChange}
              />
            <RaisedButton
              secondary={true}
              onTouchTap={this.handleOpen}
              icon={<IconSearch />}
              className="ck-clear-uppercase ck-inline ck-btn-table-filter-search"
              onClick={this._onFilterSubmit}
            />
          </form>
        </div>
        <Table
          rowHeight={35}
          rowsCount={sortedDataList.getSize()}
          headerHeight={35}
          width={this.state.tableWidth}
          height={((sortedDataList.getSize() + 1) * 35) + 2}
          {...this.props}>
          <Column
            columnKey="firstName"
            columnDesc="First Name"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.firstName}>
                First Name
              </SortHeaderCell>
            }
            cell={<TextCell data={sortedDataList} />}
            width={150}
            flexGrow={2}
          />
          <Column
            columnKey="lastName"
            columnDesc="Last Name"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.lastName}>
                Last Name
              </SortHeaderCell>
            }
            cell={<TextCell data={sortedDataList} />}
            width={150}
            flexGrow={1}
          />
          <Column
            columnKey="dob"
            columnDesc="Date of Birth"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.dob}>
                Date of Birth
              </SortHeaderCell>
            }
            cell={<TextCell data={sortedDataList} />}
            width={125}
          />
          <Column
            columnKey="phone"
            columnDesc="Phone"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.phone}>
                Phone
              </SortHeaderCell>
            }
            cell={<TextCell data={sortedDataList} />}
            width={150}
          />
          <Column
            columnKey="email"
            columnDesc="Email"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.email}>
                Email
              </SortHeaderCell>
            }
            cell={<TextCell data={sortedDataList} />}
            width={200}
            flexGrow={2}
          />
          <Column
            columnKey="notes"
            columnDesc="Notes"
            header={
              <SortHeaderCell
                onSortChange={this._onSortChange}
                sortDir={colSortDirs.notes}>
                Notes
              </SortHeaderCell>
            }
            cell={<TextCell data={sortedDataList} />}
            width={300}
            flexGrow={3}
          />
        </Table>
      </div>
    );
  }
}

// Contact Form.
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
        <div className="ck-row-half ck-right ck-align-right">
          <RaisedButton
            label="Contacts Keeper"
            secondary={true}
            onTouchTap={this.handleOpen}
            icon={<IconContentAddCircle />}
            className="ck-clear-uppercase ck-btn-dialog"
          />
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
