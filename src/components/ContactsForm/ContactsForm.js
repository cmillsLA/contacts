import React from 'react';
import { connect } from 'react-redux';
import { addTodo } from '../../actions';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconNavCancelCircle from 'material-ui/svg-icons/navigation/cancel';
import TextField from 'material-ui/TextField';
import './ContactsForm.css';

const styles = {
  errorStyle: {
    color: '#f58025',
  },
  underlineStyle: {
    borderColor: '#fff',
    bottom: '17px'
  },
  underlineStyleTextarea: {
    borderColor: '#fff',
    bottom: '8px'
  },
  underlineFocusStyle: {
    borderColor: '#f58025'
  },
  hintStyles: {
    bottom:'27px',
    left: '6px'
  },
  errorStyles: {
    top:'1px',
    position: 'absolute',
    right: '0'
  }
};

const _formFields = ['firstName', 'lastName', 'dob', 'phone', 'email', 'notes'];

class ContactsForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: true,
      firstName: { value: '', error: false },
      lastName: { value: '', error: false },
      dob: { value: '', error: false },
      phone: { value: '', error: false },
      email: { value: '', error: false },
      notes: { value: '', error: false },
    };

    this._showSnackbar = props.showSnackbar.bind(this);
    this._handleClose = props.handleClose.bind(this);
    this._validEmail = this._validEmail.bind(this);
    this._validPhone = this._validPhone.bind(this);
    this._addErrorMessage = this._addErrorMessage.bind(this);
    this._formatError = this._formatError.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleFieldValidation = this._handleFieldValidation.bind(this);
    this._handleValidation = this._handleValidation.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._addTodo = this._addTodo.bind(this);
    this.setState = this.setState.bind(this);
  }

  _formatError(str) {
    switch(str) {
      case 'dob':
        str = 'date of birth'
        break;
      case 'email':
        str = 'email address'
        break;
      case 'phone':
        str = 'phone number';
        break;
      default:
        str = str.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
    }
    return str;
  }

  /*_disableSubmit() {
    this.setState({
      disableSubmit: !this._handleValidation()
    })
    return false;
  }*/

  _addTodo() {
    this.props.dispatch(
      addTodo(
        this.state.firstName.value,
        this.state.lastName.value,
        this.state.dob.value,
        this.state.phone.value,
        this.state.email.value,
        this.state.notes.value
      )
    )
    return true;
  }

  _validDate(str) {
    const _dateRegex = /^\d{2}([./-])\d{2}\1\d{4}$/;
    return _dateRegex.test(str);
  }

  _validEmail(_str) {
    const _emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return _emailRegex.test(_str);
  }

  _validPhone(str) {
    const _phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return _phoneRegex.test(str);
  }

  _addErrorMessage(_key, _value) {
    this.setState({
      [_key]: {
        value: _value,
        error: 'Please enter a valid ' + this._formatError(_key) + '.'
      }
    })
    return true;
  }

  _handleFieldValidation(field, value) {
    let _valid = true;
    switch(field) {
      case 'email':
          _valid = !value || !this._validEmail(value) ? false : true;
        break;
      case 'phone':
          _valid = !value || !this._validPhone(value) ? false : true;
        break;
      case 'dob':
          _valid = !value || !this._validDate(value) ? false : true;
        break;
      default:
          _valid = !value ? false : true;
        break;
    }
    return _valid;
  }

  _handleValidation(printErrors) {
    let _valid = true;
    let _fields = _formFields.slice(0, -1);
    for(let field in _fields) {
      const _key = _fields[field];
      const _value = this.state[_key].value;
      if(!this._handleFieldValidation(_key, _value)) {
        if(printErrors === true) {
          this._addErrorMessage(_key, _value);
        }
        _valid = false;
      }
    }
    return _valid;
  }

  _handleChange(e, value) {
    const _target = e.target;
    const _value = _target.value;
    if(_value) {
      this.setState({
        [_target.name]: {
          value: _value,
          error: false
        }
      })
    }
    //return this._disableSubmit();
  };

  _handleSubmit(e) {
    e.preventDefault();
    if(this._handleValidation(true) && this._addTodo()) {
      this._showSnackbar();
    }
  }

  render() {
    return(
      <div>
        <form onSubmit={this._handleSubmit} className="ck-form-contacts">
          <div className="ck-row ck-left">
            <div className="ck-row-half ck-left">
              <TextField
                floatingLabelText="First Name"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                name={'firstName'}
                onChange={this._handleChange}
                errorText={this.state.firstName.error}
                errorStyle={styles.errorStyles}
              />
            </div>
            <div className="ck-row-half ck-left">
              <TextField
                floatingLabelText="Last Name"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                name={'lastName'}
                onChange={this._handleChange}
                errorText={this.state.lastName.error}
                errorStyle={styles.errorStyles}
              />
            </div>
          </div>
          <div className="ck-row ck-left">
            <div className="ck-row-half ck-left">
              <TextField
                floatingLabelText="Date of Birth"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                hintText="MM-DD-YYYY"
                hintStyle={styles.hintStyles}
                name={'dob'}
                onChange={this._handleChange}
                errorText={this.state.dob.error}
                errorStyle={styles.errorStyles}
              />
            </div>
            <div className="ck-row-half ck-left">
              <TextField
                floatingLabelText="Phone Number"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                hintText="555-555-5555"
                hintStyle={styles.hintStyles}
                name={'phone'}
                onChange={this._handleChange}
                errorText={this.state.phone.error}
                errorStyle={styles.errorStyles}
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
                name={'email'}
                onChange={this._handleChange}
                errorText={this.state.email.error}
                errorStyle={styles.errorStyles}
              />
            </div>
          </div>
          <div className="ck-row">
            <TextField
              floatingLabelText="Notes (optional)"
              floatingLabelFixed={true}
              multiLine={true}
              rows={3}
              rowsMax={5}
              className="ck-input-text ck-input-textarea"
              underlineStyle={styles.underlineStyleTextarea}
              underlineFocusStyle={styles.underlineFocusStyle}
              name={'notes'}
              onChange={this._handleChange}
            />
          </div>
          <div className="ck-row ck-border-top-gray">
            <RaisedButton
              label="Save"
              primary={true}
              //disabled={this.state.disableSubmit}
              type="submit"
              className="ck-clear-uppercase ck-dialog-save"
            />
          </div>
        </form>
        <FlatButton
          onTouchTap={this._handleClose}
          icon={<IconNavCancelCircle />}
          className="ck-dialog-cancel"
        />
      </div>
    )
  }
}

ContactsForm = connect()(ContactsForm)

export default ContactsForm
