import { createContactsTable } from '../../utils/dbOperations'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await createContactsTable()
      res.status(200).json({ message: 'Contacts table created successfully' })
    } catch (error) {
      console.error('Error creating contacts table:', error)
      res.status(500).json({ error: 'Failed to create contacts table' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
