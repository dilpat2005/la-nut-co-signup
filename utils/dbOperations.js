import { pool } from './supabaseClient'

export async function createTodosTable() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        is_complete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Todos table created successfully')
  } catch (error) {
    console.error('Error creating todos table:', error)
    throw error
  } finally {
    client.release()
  }
}

export async function fetchTodos() {
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT * FROM todos ORDER BY id ASC')
    return result.rows
  } catch (error) {
    console.error('Error fetching todos:', error)
    throw error
  } finally {
    client.release()
  }
}

export async function addTodo(title) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'INSERT INTO todos (title) VALUES ($1) RETURNING *',
      [title]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Error adding todo:', error)
    throw error
  } finally {
    client.release()
  }
}

export async function toggleTodoCompletion(id, is_complete) {
  const client = await pool.connect()
  try {
    const result = await client.query(
      'UPDATE todos SET is_complete = $1 WHERE id = $2 RETURNING *',
      [!is_complete, id]
    )
    return result.rows[0]
  } catch (error) {
    console.error('Error updating todo:', error)
    throw error
  } finally {
    client.release()
  }
}
