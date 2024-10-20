import { useState, useEffect } from 'react'

export default function Home() {
  const [contacts, setContacts] = useState([])
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function initializeApp() {
      try {
        await fetch('/api/createContactsTable');
        await fetchAndSetContacts()
      } catch (error) {
        console.error('Error initializing app:', error)
        setError('Failed to initialize app. Please try again.')
      }
    }
    initializeApp()
  }, [])

  async function fetchAndSetContacts() {
    try {
      const response = await fetch('/api/contacts')
      const fetchedContacts = await response.json()
      setContacts(fetchedContacts)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setError('Failed to fetch contacts. Please try again.')
    }
  }

  async function handleAddContact() {
    if (newEmail.trim() === '' || newPhone.trim() === '') return
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail, phone: newPhone }),
      })
      const newContact = await response.json()
      setContacts([...contacts, newContact])
      setNewEmail('')
      setNewPhone('')
    } catch (error) {
      console.error('Error adding contact:', error)
      setError('Failed to add contact. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Los Angeles Nut Company Contact List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter email"
        />
        <input
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter phone number"
        />
        <button onClick={handleAddContact} className="bg-blue-500 text-white p-2 rounded">
          Add Contact
        </button>
      </div>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id} className="mb-2">
            <span className="mr-4">Email: {contact.email}</span>
            <span>Phone: {contact.phone}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
