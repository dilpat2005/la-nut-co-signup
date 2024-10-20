import { fetchContacts, addContact } from '../../../utils/dbOperations'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const contacts = await fetchContacts()
      res.status(200).json(contacts)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      res.status(500).json({ error: 'Failed to fetch contacts' })
    }
  } else if (req.method === 'POST') {
    try {
      const { email, phone } = req.body
      const newContact = await addContact(email, phone)
      res.status(201).json(newContact)
    } catch (error) {
      console.error('Error adding contact:', error)
      res.status(500).json({ error: 'Failed to add contact' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
