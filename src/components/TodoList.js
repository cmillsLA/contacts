import React, { PropTypes } from 'react'
import Todo from './Todo'

const TodoList = ({ todos, onTodoClick }) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dob: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
    notes: PropTypes.string
  }).isRequired).isRequired,
  onTodoClick: PropTypes.func.isRequired
}

export default TodoList