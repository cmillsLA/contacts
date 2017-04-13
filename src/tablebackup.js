

  render() {
    var {sortedDataList, colSortDirs} = this.state;
    return (
      <Table
        rowHeight={35}
        rowsCount={sortedDataList.getSize()}
        headerHeight={35}
        width={this._getWindowWidth()}
        height={((sortedDataList.getSize() + 1) * 35) + 2}
        {...this.props}>
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
          width={150}
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
          width={150}
          flexGrow={1}
        />
        <Column
          columnKey="dob"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.dob}>
              Date of Birth
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={150}
        />
        <Column
          columnKey="phone"
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={colSortDirs.phone}>
              Phone
            </SortHeaderCell>
          }
          cell={<TextCell data={sortedDataList} />}
          width={100}
        />
        <Column
          columnKey="email"
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
    );
  }
}