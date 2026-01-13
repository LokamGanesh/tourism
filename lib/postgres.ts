import { Pool, PoolClient } from 'pg'

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://jharkhandtourism_user:a6XDleRfRgnfKFUxx7byBE0P0ymJSTWn@dpg-d5j7htu3jp1c73fahdt0-a.frankfurt-postgres.render.com/jharkhandtourism'

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable')
}

interface PostgresCache {
  pool: Pool | null
}

declare global {
  var postgres: PostgresCache | undefined
}

let cached: PostgresCache = global.postgres || { pool: null }

if (!global.postgres) {
  global.postgres = cached
}

export function getPool(): Pool {
  if (!cached.pool) {
    cached.pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render.com hosted databases
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    // Handle pool errors
    cached.pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err)
    })
  }

  return cached.pool
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const pool = getPool()
  const result = await pool.query(text, params)
  return result.rows
}

export async function getClient(): Promise<PoolClient> {
  const pool = getPool()
  return await pool.connect()
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export default { getPool, query, getClient, transaction }
