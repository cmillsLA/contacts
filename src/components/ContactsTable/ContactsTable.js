import React from 'react';
import { connect } from 'react-redux'
import IconSearch from 'material-ui/svg-icons/action/search';
import {Table, Column, Cell} from 'fixed-data-table';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './ContactsTable.css';
import { addTodo } from '../../actions';

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

let NoContacts = (elemState) => {
  if(elemState.noContacts) {
    return(
      <div className="ck-mt20">Please add a contact by using the Contacts Keeper button above.</div>
    )
  }
  return false
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
    {console.log('textcell data', data)}
    <span className="ck-responsive-th">{_ckColumnName(columnKey)}</span>
    {data[rowIndex][columnKey]}
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

const mapStateToProps = (state) => {
  console.log('map state to props', state);
  return {
    todos: state.todos
  }
}

class ContactsTable extends React.Component {
  constructor(props) {
    super(props);

    this._defaultSortIndexes = [];

    this.state = {
      colSortDirs: {},
      tableWidth  : 1000,
      tableHeight : 500,
      filterval: '',
      sortedDataList: []
    };

    //var size = this._dataList.getSize();
    var size =  Object.keys(this.state.sortedDataList).length;
    for (var index = 0; index < size; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.ckTableWidth = window.offsetWidth - 80;

    this._onSortChange = this._onSortChange.bind(this);
    this._update = this._update.bind(this);
    this._getHeight = this._getHeight.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFilterSubmit = this._onFilterSubmit.bind(this);
    this._onBlurChange = this._onBlurChange.bind(this);

    /* DEMO */
    this._addTodo = this._addTodo.bind(this);
    /* */
  }

  _getListLength() {
    return Object.keys(this.state.sortedDataList).length;
  }

  _addTodo(index) {
    this.props.dispatch(
      addTodo(
        '(first name ' + index + ')',
        '(last name ' + index + ')',
        '(test dob ' + index + ')',
        '(Phone 999-999-9999)',
        '(testing@test' + index + '.com)',
        '(Test - ' + index + ')'
      )
    )
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
    for(let i = 0; i < 10; i += 1) {
      this._addTodo(i);
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      sortedDataList: props.todos
    })
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
    //var size = this._dataList.getSize();
    var size = this._getListLength();
    var filteredIndexes = [];
    var filterFound = (firstName, lastName, email) => {
      return firstName.toLowerCase().indexOf(filterBy) !== -1 ||
      lastName.toLowerCase().indexOf(filterBy) !== -1 ||
      email.toLowerCase().indexOf(filterBy) !== -1
    };
    for (var index = 0; index < size; index++) {
      console.log('running for index: ' + index);
      /*var {firstName} = this._dataList.getObjectAt(index);
      var {lastName} = this._dataList.getObjectAt(index);
      var {email} = this._dataList.getObjectAt(index);*/
      console.log('filter submit', this.state.sortedDataList[index]);
      var {firstName} = this.state.sortedDataList[index];
      var {lastName} = this.state.sortedDataList[index];
      var {email} = this.state.sortedDataList[index];
      console.log('firstName: ' + firstName, 'lastName: ' + lastName, 'email: ' + email);
      console.log('filter found: ' + filterFound(firstName, lastName, email));
      if (filterFound(firstName, lastName, email)) {
        filteredIndexes.push(index);
      }
      console.log('finished', filteredIndexes);
    }

    this.setState({
      //sortedDataList: new DataListWrapper(filteredIndexes, this.state.sortedDataList),
      sortedDataList: new DataListWrapper(filteredIndexes, this.state.sortedDataList),
    });

  }

  _update() {
    this.setState({
      tableWidth  : window.innerWidth - 80
    });
  }

  _getHeight() {
    return this.state.sortedDataList && Object.keys(this.state.sortedDataList).length ? ((Object.keys(this.state.sortedDataList).length + 1) * 45) + 2 : 45;
  }

  _onSortChange(columnKey, sortDir) {
    console.log('on sort change');
    var sortIndexes = this._defaultSortIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      /*var valueA = this._dataList.getObjectAt(indexA)[columnKey];
      var valueB = this._dataList.getObjectAt(indexB)[columnKey];*/
      var valueA = this.testData.getObjectAt(indexA)[columnKey];
      var valueB = this.testData.getObjectAt(indexB)[columnKey];
      var sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = (sortVal * -1);
      }

      return sortVal;
    });

    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this.state.sortedDataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  render() {
    var {sortedDataList, colSortDirs} = this.state;
    var _noContacts = !Object.keys(sortedDataList).length;
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
              disabled={_noContacts}
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
          rowsCount={Object.keys(sortedDataList).length ? Object.keys(sortedDataList).length : 1}
          headerHeight={45}
          width={this.state.tableWidth}
          height={this._getHeight()}
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
            cell={!_noContacts ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts ? <TextCell data={sortedDataList} /> : null}
            width={100}
            flexGrow={3}
          />
        </Table>
        <NoContacts className="ck-no-contacts" noContacts={_noContacts} />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(ContactsTable)

//export default ContactsTable;
