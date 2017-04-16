let nextContactId = 0
export const addContact = (firstName, lastName, dob, phone, email, notes) => {
  return {
    type: 'ADD_CONTACT',
    id: nextContactId++,
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    phone: phone,
    email: email,
    notes: notes
  }
}
