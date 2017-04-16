import React, { PropTypes } from 'react'

const Todo = ({ firstName, lastName, dob, phone, email, notes }) => (
  <li>
    {firstName}
    {lastName}
    {dob}
    {phone}
    {email}
    {notes}
  </li>

)

Todo.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  dob: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  notes: PropTypes.string
}

export default Todo