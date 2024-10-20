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
    <div className="relative min-h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
      >
        <source src="/background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="container mx-auto p-4">
          <h1 className="text-5xl font-bold mb-8 text-center text-white">Los Angeles Nut Company Contact List</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 mb-4 text-center font-semibold">{successMessage}</p>}
          <div className="mb-8 bg-white bg-opacity-80 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border p-2 mr-2 w-full mb-2 rounded bg-white bg-opacity-50"
              placeholder="Enter email"
            />
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="border p-2 mr-2 w-full mb-4 rounded bg-white bg-opacity-50"
              placeholder="Enter phone number"
            />
            <button onClick={handleAddContact} className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition duration-300">
              Add Contact
            </button>
          </div>
          <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
            <h2 className="text-2xl font-semibold mb-4 text-green-800">Contact List</h2>
            <ul>
              {contacts.map(contact => (
                <li key={contact.id} className="mb-2 p-2 border-b border-gray-200">
                  <span className="mr-4 font-medium">Email: {contact.email}</span>
                  <span className="font-medium">Phone: {contact.phone}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 text-sm text-white bg-black bg-opacity-50 p-4 rounded-lg shadow-md backdrop-filter backdrop-blur-lg">
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
      </div>
    </div>
  )
}
