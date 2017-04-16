let nextTodoId = 0
export const addTodo = (firstName, lastName, dob, phone, email, notes) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    phone: phone,
    email: email,
    notes: notes
  }
}
