import React, { PropTypes } from 'react'

const Todo = ({ onClick, completed, firstName, lastName, dob, phone, email, notes }) => (
  <li
    onClick={onClick}
  >
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