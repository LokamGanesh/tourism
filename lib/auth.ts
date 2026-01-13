import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Use a consistent JWT secret - ensure it's loaded from environment
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Log warning if using fallback secret (helps debug issues)
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not found in environment variables. Using fallback secret.')
}

export async function hashPassword(password: string): Promise<string> {
  return await bcryptjs.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcryptjs.compare(password, hashedPassword)
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }
    return decoded
  } catch (error) {
    return null
  }
}

// Default admin and government credentials
export const DEFAULT_CREDENTIALS = {
  admin: {
    email: 'admin@jharkhand-tourism.gov.in',
    password: 'Admin@2024',
    name: 'Tourism Admin',
    role: 'admin' as const,
    department: 'Tourism Department',
    permissions: ['verify_certificates', 'approve_travels', 'manage_users']
  },
  government: {
    email: 'gov@jharkhand.gov.in',
    password: 'Gov@2024',
    name: 'Government Official',
    role: 'government' as const,
    department: 'Tourism Ministry',
    position: 'Director',
    accessLevel: 5
  }
}
