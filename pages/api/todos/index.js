import { fetchTodos, addTodo } from '../../../utils/dbOperations'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const todos = await fetchTodos()
      res.status(200).json(todos)
    } catch (error) {
      console.error('Error fetching todos:', error)
      res.status(500).json({ error: 'Failed to fetch todos' })
    }
  } else if (req.method === 'POST') {
    try {
      const { title } = req.body
      const newTodo = await addTodo(title)
      res.status(201).json(newTodo)
    } catch (error) {
      console.error('Error adding todo:', error)
      res.status(500).json({ error: 'Failed to add todo' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
