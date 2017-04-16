const contact = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_CONTACT':
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

const contacts = (state = [], action) => {
  switch (action.type) {
    case 'ADD_CONTACT':
      return [
        ...state,
        contact(undefined, action)
      ]
    default:
      return state
  }
}

export default contacts