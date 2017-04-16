import React from 'react';
import { connect } from 'react-redux'
import IconSearch from 'material-ui/svg-icons/action/search';
import {Table, Column, Cell} from 'fixed-data-table';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import './ContactsTable.css';
import { addTodo } from '../../actions';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const reverseSortDirection = (sortDir) => {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

const NoContacts = (elemState) => {
  if(elemState.noContacts) {
    return(
      <div className="ck-mt20">Please add a contact by using the Contacts Keeper button above.</div>
    )
  }
  return false;
}

const NoResults = (elemState) => {
  if(elemState.noResults) {
    return(
      <div className="ck-mt20">No results found.</div>
    )
  }
  return false;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);

    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    let {onSortChange, sortDir, children, ...props} = this.props;
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

const _ckColumnName = (name) => {
  return name.replace(/([A-Z])/g, ' $1').trim();
}

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    <span className="ck-responsive-th">{_ckColumnName(columnKey)}</span>
    {data[rowIndex][columnKey]}
  </Cell>
);

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
  return {
    todos: state.todos
  }
}

class ContactsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colSortDirs: {},
      tableWidth  : 1000,
      tableHeight : 500,
      filterval: '',
      sortedDataList: [],
      _cache: [],
      _defaultSortIndexes: []
    };

    this.ckTableWidth = window.offsetWidth - 80;

    this._onSortChange = this._onSortChange.bind(this);
    this._update = this._update.bind(this);
    this._getHeight = this._getHeight.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onFilterSubmit = this._onFilterSubmit.bind(this);
    this._onBlurChange = this._onBlurChange.bind(this);
    this._setDefaultSortIndexes = this._setDefaultSortIndexes.bind(this);

    /* DEMO */
    this._addTodo = this._addTodo.bind(this);
    /* */
  }

  _getListLength() {
    return Object.keys(this.state.sortedDataList).length;
  }

  _addTodo(name, index) {
    this.props.dispatch(
      addTodo(
        '(' + name + ' ' + index + ')',
        '(last name ' + index + ')',
        '(test dob ' + index + ')',
        '(Phone 999-999-9999)',
        '(testing@test' + index + '.com)',
        '(Test - ' + index + ')'
      )
    )
  }

  _setDefaultSortIndexes(contacts) {
    let _indexes = [];
    const size =  Object.keys(contacts).length;
    for (let i=0; i<size; i++) {
      _indexes.push(i);
    }
    this.setState({
      _defaultSortIndexes: _indexes
    })
    return true;
  }

  componentDidMount() {
    const win = window;
    if (win.addEventListener) {
      win.addEventListener('resize', this._update, false);
    } else if (win.attachEvent) {
      win.attachEvent('onresize', this._update);
    } else {
      win.onresize = this._update;
    }
    this._update();
    /* Demo */
    var _tempNames = ['Chris', 'Ken', 'Tim', 'Ruben', 'Willett', 'Christopher'];
    for(let i = 0; i < 6; i += 1) {
      this._addTodo(_tempNames[i], i);
    }
    /* /Demo */
  }

  componentWillReceiveProps(props) {
    this.setState({
      sortedDataList: props.todos,
      _cache: props.todos
    })
    if(this._setDefaultSortIndexes(props.todos)) {
      this._update();
    }
  }

  componentWillUnmount() {
    const win = window;
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
        sortedDataList: this.state._cache,
      });
    }
  }

  _onFilterSubmit(e) {
    e.preventDefault();
    if (!this.state.filterval && this._setDefaultSortIndexes(this.state._cache)) {
      this.setState({
        sortedDataList: this.state._cache,
      });
      return false;
    }
    const filterBy = this.state.filterval.toLowerCase();
    const size = this._getListLength();
    const filterFound = (firstName, lastName, email) => {
      return firstName.toLowerCase().indexOf(filterBy) !== -1 ||
      lastName.toLowerCase().indexOf(filterBy) !== -1 ||
      email.toLowerCase().indexOf(filterBy) !== -1
    };
    let _filteredData = {};
    for (let index = 0; index < size; index++) {
      const {firstName} = this.state.sortedDataList[index];
      const {lastName} = this.state.sortedDataList[index];
      const {email} = this.state.sortedDataList[index];
      const _filteredSize = Object.keys(_filteredData).length;
      if (filterFound(firstName, lastName, email)) {
        _filteredData[_filteredSize] = this.state.sortedDataList[index];
      }
    }
    this._setDefaultSortIndexes(_filteredData);
    this.setState({
      sortedDataList: _filteredData,
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
    let sortIndexes = this.state._defaultSortIndexes.slice();
    sortIndexes.sort((indexA, indexB) => {
      let valueA = this.state.sortedDataList[indexA][columnKey];
      let valueB = this.state.sortedDataList[indexB][columnKey];
      let sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal *= -1
      }
      return sortVal;
    });
    let _sortedIndexes = {};
    for(let i=0; i<sortIndexes.length; i+=1) {
      _sortedIndexes[i] = this.state.sortedDataList[sortIndexes[i]];
    }

    this.setState({
      sortedDataList: _sortedIndexes,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  render() {
    let {sortedDataList, colSortDirs, _cache} = this.state;
    let _noContacts = !Object.keys(_cache).length;
    let _noResults = !Object.keys(sortedDataList).length && Object.keys(_cache).length;
    return (
      <div>
        <div className="ck-table-filter ck-row-60-tablet ck-align-left ck-align-center-mobile ck-mb10">
          <form onSubmit={this._onFilterSubmit}>
            <TextField
              className="ck-input-text ck-table-filter-input ck-inline"
              underlineStyle={tablestyles.underlineStyle}
              underlineFocusStyle={tablestyles.underlineFocusStyle}
              hintText="Filter by First Name, Last Name, or Email"
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
            cell={!_noContacts && !_noResults ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts && !_noResults ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts && !_noResults ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts && !_noResults ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts && !_noResults ? <TextCell data={sortedDataList} /> : null}
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
            cell={!_noContacts && !_noResults ? <TextCell data={sortedDataList} /> : null}
            width={100}
            flexGrow={3}
          />
        </Table>
        <NoContacts className="ck-no-contacts" noContacts={_noContacts} />
        <NoResults className="ck-no-contacts" noResults={_noResults} />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(ContactsTable)

//export default ContactsTable;
