const todo = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        firstName: action.firstName,
        lastName: action.lastName,
        dob: action.dob,
        phone: action.phone,
        email: action.email,
        notes: action.notes,
      }
    default:
      return state
  }
}

const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ]
    default:
      return state
  }
}

export default todos