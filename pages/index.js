import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    checkTodosTable()
    fetchTodos()
  }, [])

  async function checkTodosTable() {
    try {
      const { error } = await supabase
        .from('todos')
        .select('id')
        .limit(1)

      if (error) {
        console.error('Error checking todos table:', error)
        setError(`Failed to check todos table: ${error.message}`)
      } else {
        console.log('Todos table exists and is accessible')
      }
    } catch (error) {
      console.error('Error in checkTodosTable function:', error)
      setError(`Failed in checkTodosTable function: ${error.message}`)
    }
  }

  async function fetchTodos() {
    try {
      console.log('Fetching todos...')
      let { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) throw error
      console.log('Fetched todos:', data)
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
      setError(`Failed to fetch todos: ${error.message || 'Unknown error'}. Details: ${JSON.stringify(error, null, 2)}`)
    }
  }

  async function addTodo() {
    if (newTodoTitle.trim() === '') return
    try {
      console.log('Adding todo:', newTodoTitle)
      const { data, error } = await supabase
        .from('todos')
        .insert([{ title: newTodoTitle, is_complete: false }])
        .select()
      
      console.log('Supabase response:', { data, error })
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      if (data && data.length > 0) {
        console.log('Todo added successfully:', data)
        setTodos([...todos, ...data])
        setNewTodoTitle('')
      } else {
        console.error('No data returned from Supabase')
        throw new Error('No data returned from database')
      }
    } catch (error) {
      console.error('Error adding todo:', error)
      setError(`Failed to add todo: ${error.message || 'Unknown error'}. Details: ${JSON.stringify(error, null, 2)}`)
    }
  }

  console.log('Current todos:', todos)

  async function toggleTodoCompletion(id, is_complete) {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: !is_complete })
        .eq('id', id)
      
      if (error) throw error
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, is_complete: !is_complete } : todo
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
        <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded">
          Add Todo
        </button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={todo.is_complete}
              onChange={() => toggleTodoCompletion(todo.id, todo.is_complete)}
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
