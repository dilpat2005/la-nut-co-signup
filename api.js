export async function fetchContacts() {
  try {
    const response = await fetch('/api/contacts');
    if (!response.ok) {
      throw new Error('Failed to fetch contacts');
    }
    const contacts = await response.json();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('An unexpected error occurred. Please try again later.');
  }
}

export async function addContact(email, phone) {
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, phone }),
    });
    if (!response.ok) {
      throw new Error('Failed to add contact');
    }
    const newContact = await response.json();
    return newContact;
  } catch (error) {
    console.error('Error adding contact:', error);
    throw new Error('An unexpected error occurred. Please try again later.');
  }
}
