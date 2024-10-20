import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState('')

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: true })
    
    if (error) console.log('Error fetching todos:', error)
    else setTodos(data)
  }

  async function addTodo() {
    if (newTodoTitle.trim() === '') return
    const { data, error } = await supabase
      .from('todos')
      .insert({ title: newTodoTitle, is_complete: false })
      .select()
    
    if (error) console.log('Error adding todo:', error)
    else {
      setTodos([...todos, ...data])
      setNewTodoTitle('')
    }
  }

  async function toggleTodoCompletion(id, is_complete) {
    const { error } = await supabase
      .from('todos')
      .update({ is_complete: !is_complete })
      .eq('id', id)
    
    if (error) console.log('Error updating todo:', error)
    else {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, is_complete: !is_complete } : todo
      ))
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
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
