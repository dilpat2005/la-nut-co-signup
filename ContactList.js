import { useState, useEffect } from 'react';
import { fetchContacts } from './api';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts()
      .then(data => {
        setContacts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
        setError('Unable to load contacts at this time. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Contacts</h2>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>{contact.name}</li>
        ))}
      </ul>
    </div>
  );
}
