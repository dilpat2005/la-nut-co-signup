import { pool } from './supabaseClient'

export async function createContactsTable() {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server side');
  }
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Contacts table created successfully')
  } catch (error) {
    console.error('Error creating contacts table:', error)
    throw error
  } finally {
    client.release()
  }
}

export async function fetchContacts() {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server side');
  }
  const client = await pool.connect()
  try {
    const result = await client.query('SELECT * FROM contacts ORDER BY id ASC')
    return result.rows
  } catch (error) {
    console.error('Error fetching contacts:', error)
    throw error
  } finally {
    client.release()
  }
}

export async function addContact(email, phone) {
  if (typeof window !== 'undefined') {
    throw new Error('This function can only be called on the server side');
  }
  const client = await pool.connect()
  try {
    const result = await client.query(
      'INSERT INTO contacts (email, phone) VALUES ($1, $2) RETURNING *',
      [email, phone]
    )
    if (result.rows.length === 0) {
      throw new Error('Failed to insert contact')
    }
    return result.rows[0]
  } catch (error) {
    console.error('Error adding contact:', error)
    throw error
  } finally {
    client.release()
  }
}
