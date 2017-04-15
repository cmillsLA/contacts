let nextTodoId = 0
export const addTodo = (text, firstName, lastName, dob, phone, email, notes) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text: text,
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    phone: phone,
    email: email,
    notes: notes
  }
}
