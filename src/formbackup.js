class NewContactForm extends React.Component {
  constructor(props) {
    super(props);

    //this._onBlurChange = this._onBlurChange.bind(this);
  }
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
                errorText="Please enter a first name."
              />
            </div>
            <div className="ck-row-half">
              <TextField
                floatingLabelText="Last Name"
                floatingLabelFixed={true}
                className="ck-input-text"
                underlineStyle={styles.underlineStyle}
                underlineFocusStyle={styles.underlineFocusStyle}
                errorText="Please enter a last name."
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
                errorText="Please enter a Birthday."
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
                errorText="Please enter a phone number."
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
                errorText="Please enter a valid email address."
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