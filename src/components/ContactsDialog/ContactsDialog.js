import React, { PropTypes, Component } from 'react';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconContentAddCircle from 'material-ui/svg-icons/content/add-circle';
import IconNavCancelCircle from 'material-ui/svg-icons/navigation/cancel';
import IconSearch from 'material-ui/svg-icons/action/search';
import ContactsForm from '../../containers/ContactsForm/ContactsForm';
import './ContactsDialog.css';

class ContactsDialog extends React.Component {
  state = {
    open: false,
    snackbarOpen: false
  };

  handleOpen = () => {
    this.setState({snackbarOpen: false})
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  showSnackbar = () => {
    setTimeout(() =>
      this.setState({snackbarOpen: true}),
    250);
    this.handleClose();
  }

  render() {
    return (
      <div>
        <div className="ck-btn-contacts-keeper ck-row-half ck-row-40-tablet ck-right ck-align-right ck-align-center-mobile ck-mb20-mobile">
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
          modal={false}
          open={this.state.open}
          autoScrollBodyContent={true}
          titleClassName="ck-dialog-header"
          contentClassName="ck-dialog-content"
          onRequestClose={this.handleClose}
        >
          <ContactsForm
            handleClose={this.handleClose}
            showSnackbar={this.showSnackbar}  />
        </Dialog>
        <Snackbar
          open={this.state.snackbarOpen}
          message="A new contact has been added."
          autoHideDuration={2500}
          bodyStyle={{ backgroundColor: '#216fb5'}}
        />
      </div>
    );
  }
}

export default ContactsDialog;
