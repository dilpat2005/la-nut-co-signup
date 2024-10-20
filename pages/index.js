import { useState, useEffect } from 'react'

export default function Home() {
  const [contacts, setContacts] = useState([])
  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

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
      if (!response.ok) {
        throw new Error('Failed to add contact')
      }
      const newContact = await response.json()
      setContacts([...contacts, newContact])
      setNewEmail('')
      setNewPhone('')
      setSuccessMessage('Thank you for submitting your information!')
      setTimeout(() => setSuccessMessage(''), 5000) // Clear message after 5 seconds
    } catch (error) {
      console.error('Error adding contact:', error)
      setError('Failed to add contact. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Los Angeles Nut Company Contact List</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4 text-center font-semibold">{successMessage}</p>}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="border p-2 mr-2 w-full mb-2 rounded"
          placeholder="Enter email"
        />
        <input
          type="tel"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="border p-2 mr-2 w-full mb-4 rounded"
          placeholder="Enter phone number"
        />
        <button onClick={handleAddContact} className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition duration-300">
          Add Contact
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-green-800">Contact List</h2>
        <ul>
          {contacts.map(contact => (
            <li key={contact.id} className="mb-2 p-2 border-b">
              <span className="mr-4 font-medium">Email: {contact.email}</span>
              <span className="font-medium">Phone: {contact.phone}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 text-sm text-gray-600 bg-white p-4 rounded-lg shadow-md">
        <p className="mb-2"><strong>Disclaimer:</strong> By submitting your information, you agree that Los Angeles Nut Company may use your email and phone number for:</p>
        <ul className="list-disc pl-5 mb-2">
          <li>Remarketing purposes</li>
          <li>Sending reminders and updates</li>
          <li>Promotional content</li>
          <li>Exclusive offers</li>
        </ul>
        <p>We value your privacy and will not share your information with third parties. You can unsubscribe at any time.</p>
      </div>
    </div>
  )
}
