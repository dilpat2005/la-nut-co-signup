import { createTodosTable } from '../../utils/dbOperations'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await createTodosTable()
      res.status(200).json({ message: 'Todos table created successfully' })
    } catch (error) {
      console.error('Error creating todos table:', error)
      res.status(500).json({ error: 'Failed to create todos table' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
