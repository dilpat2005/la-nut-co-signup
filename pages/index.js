import { useState, useEffect } from 'react'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function initializeApp() {
      try {
        await fetch('/api/createTodosTable');
        await fetchAndSetTodos()
      } catch (error) {
        console.error('Error initializing app:', error)
        setError('Failed to initialize app. Please try again.')
      }
    }
    initializeApp()
  }, [])

  async function fetchAndSetTodos() {
    try {
      const response = await fetch('/api/todos')
      const fetchedTodos = await response.json()
      setTodos(fetchedTodos)
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError('Failed to fetch todos. Please try again.')
    }
  }

  async function handleAddTodo() {
    if (newTodoTitle.trim() === '') return
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodoTitle }),
      })
      const newTodo = await response.json()
      setTodos([...todos, newTodo])
      setNewTodoTitle('')
    } catch (error) {
      console.error('Error adding todo:', error)
      setError('Failed to add todo. Please try again.')
    }
  }

  async function handleToggleTodoCompletion(id, is_complete) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_complete: !is_complete }),
      })
      const updatedTodo = await response.json()
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    } catch (error) {
      console.error('Error updating todo:', error)
      setError('Failed to update todo. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Enter a new todo"
        />
        <button onClick={handleAddTodo} className="bg-blue-500 text-white p-2 rounded">
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.is_complete}
              onChange={() => handleToggleTodoCompletion(todo.id, todo.is_complete)}
              className="mr-2"
            />
            <span className={todo.is_complete ? 'line-through' : ''}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
