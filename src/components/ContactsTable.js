import React, { PropTypes, Component } from 'react';
import IconSearch from 'material-ui/svg-icons/action/search';
import {Table, Column, Cell} from 'fixed-data-table';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

/* Demo */
//var FakeObjectDataListStore = require('./FakeObjectDataListStore');
var RealObjectDataListStore = require('./RealObjectDataListStore');
/* /Demo */

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

class ContactsTable extends React.Component {
  constructor(props) {
    super(props);

    this._dataList = new RealObjectDataListStore(2);

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
        <div className="ck-table-filter ck-row-60-tablet ck-align-left ck-align-center-mobile ck-mb10">
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
          rowHeight={45}
          rowsCount={sortedDataList.getSize()}
          headerHeight={45}
          width={this.state.tableWidth}
          height={((sortedDataList.getSize() + 1) * 45) + 2}
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
            width={100}
            flexGrow={1}
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
            width={100}
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
            width={85}
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
            width={120}
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
            width={125}
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
            width={100}
            flexGrow={3}
          />
        </Table>
      </div>
    );
  }
}

export default ContactsTable;
