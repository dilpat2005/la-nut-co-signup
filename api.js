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
