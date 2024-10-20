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
      setSuccessMessage('Thank you for submitting your information! We appreciate your interest in Los Angeles Nut Company.')
      setTimeout(() => setSuccessMessage(''), 5000) // Clear message after 5 seconds
    } catch (error) {
      console.error('Error adding contact:', error)
      setError('Failed to add contact. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/background-image.jpg')",
          filter: "brightness(50%)"
        }}
      ></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto p-4">
          <h1 className="text-5xl font-bold mb-8 text-center text-white">Los Angeles Nut Company Contact List</h1>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          {successMessage ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-lg">
              <p className="font-bold">Success:</p>
              <p>{successMessage}</p>
            </div>
          ) : (
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
          )}
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
