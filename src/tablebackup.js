class MyTextCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    return (
      <Cell {...props}>
        {data[rowIndex][field]}
      </Cell>
    );
  }
}

class MyLinkCell extends React.Component {
  render() {
    const {rowIndex, field, data, ...props} = this.props;
    const link = data[rowIndex][field];
    return (
      <Cell {...props}>
        <a href={link}>{link}</a>
      </Cell>
    );
  }
}

class MyTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myTableData: [
        {firstName: 'Rylan', lastName: 'Test', dob: '01-01-2000', phone: '555-555-5555', email: 'Test@test.com', notes: 'N/A' },
        {firstName: 'Test', lastName: 'Tester', dob: '01-01-2000', phone: '555-555-5555', email: 'Test@test.com', notes: 'N/A' }
      ],
    };
  }

  render() {
    return (
      <Table
        rowsCount={this.state.myTableData.length}
        rowHeight={35}
        headerHeight={35}
        width={window.innerWidth - 80}
        height={(this.state.myTableData.length * 36) + 36}
        style={{diksplay: 'inline-block'}}>
        <Column
          header={<Cell>First Name</Cell>}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="firstName"
            />
          }
          width={(window.innerWidth - 80) / 6}
        />
        <Column
          header={<Cell>Last Name</Cell>}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="lastName"
            />
          }
          width={(window.innerWidth - 80) / 6}
        />
        <Column
          header={<Cell>Date of Birth</Cell>}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="dob"
            />
          }
          width={(window.innerWidth - 80) / 6}
        />
        <Column
          header={<Cell>Phone</Cell>}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="phone"
            />
          }
          width={(window.innerWidth - 80) / 6}
        />
        <Column
          header={<Cell>Email</Cell>}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="email"
            />
          }
          width={(window.innerWidth - 80) / 6}
        />
        <Column
          header={<Cell>Notes</Cell>}
          cell={
            <MyTextCell
              data={this.state.myTableData}
              field="notes"
            />
          }
          width={(window.innerWidth - 80) / 6}
        />
      </Table>
    );
  }
}