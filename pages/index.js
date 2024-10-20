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
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 bg-image-container">
        <img
          src="https://images.unsplash.com/photo-1606913084603-3e7702b01627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover"
          style={{ opacity: 0.5 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto p-6 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold mb-10 text-center text-white">Los Angeles Nut Company Contact List</h1>
        
        <div className="w-full flex flex-col items-center">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg text-lg">
              <p className="font-bold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          {successMessage ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg text-lg">
              <p className="font-bold">Success:</p>
              <p>{successMessage}</p>
            </div>
          ) : (
            <div className="mb-10 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border p-3 mr-2 w-full mb-4 rounded bg-white bg-opacity-50 text-lg"
                placeholder="Enter email"
              />
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="border p-3 mr-2 w-full mb-6 rounded bg-white bg-opacity-50 text-lg"
                placeholder="Enter phone number"
              />
              <button onClick={handleAddContact} className="bg-green-600 text-white p-3 rounded w-full hover:bg-green-700 transition duration-300 text-xl font-semibold">
                Add Contact
              </button>
            </div>
          )}
          <div className="mt-10 text-base text-white bg-black bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg text-center w-full">
            <p className="mb-3"><strong>Disclaimer:</strong> By submitting your information, you agree that Los Angeles Nut Company may use your email and phone number for:</p>
            <ul className="list-disc pl-6 mb-3">
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
