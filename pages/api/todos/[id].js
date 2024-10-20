import { toggleTodoCompletion } from '../../../utils/dbOperations'

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { is_complete } = req.body
      const updatedTodo = await toggleTodoCompletion(id, is_complete)
      res.status(200).json(updatedTodo)
    } catch (error) {
      console.error('Error updating todo:', error)
      res.status(500).json({ error: 'Failed to update todo' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
