import dbConnect from '../lib/mongodb'
import User from '../lib/models/User'
import { hashPassword, DEFAULT_CREDENTIALS } from '../lib/auth'

async function initDefaultUsers() {
  try {
    await dbConnect()
    console.log('Connected to database')

    // Create admin user
    const adminExists = await User.findOne({ email: DEFAULT_CREDENTIALS.admin.email })
    if (!adminExists) {
      const adminData = {
        ...DEFAULT_CREDENTIALS.admin,
        password: await hashPassword(DEFAULT_CREDENTIALS.admin.password),
        isVerified: true
      }
      const admin = new User(adminData)
      await admin.save()
      console.log('Admin user created successfully')
      console.log('Admin Email:', DEFAULT_CREDENTIALS.admin.email)
      console.log('Admin Password:', DEFAULT_CREDENTIALS.admin.password)
    } else {
      console.log('Admin user already exists')
    }

    // Create government user
    const govExists = await User.findOne({ email: DEFAULT_CREDENTIALS.government.email })
    if (!govExists) {
      const govData = {
        ...DEFAULT_CREDENTIALS.government,
        password: await hashPassword(DEFAULT_CREDENTIALS.government.password),
        isVerified: true
      }
      const gov = new User(govData)
      await gov.save()
      console.log('Government user created successfully')
      console.log('Government Email:', DEFAULT_CREDENTIALS.government.email)
      console.log('Government Password:', DEFAULT_CREDENTIALS.government.password)
    } else {
      console.log('Government user already exists')
    }

    console.log('\n=== DEFAULT LOGIN CREDENTIALS ===')
    console.log('Admin Login:')
    console.log('Email:', DEFAULT_CREDENTIALS.admin.email)
    console.log('Password:', DEFAULT_CREDENTIALS.admin.password)
    console.log('\nGovernment Login:')
    console.log('Email:', DEFAULT_CREDENTIALS.government.email)
    console.log('Password:', DEFAULT_CREDENTIALS.government.password)
    console.log('================================\n')

  } catch (error) {
    console.error('Error initializing default users:', error)
  }
}

// Run if called directly
if (require.main === module) {
  initDefaultUsers().then(() => process.exit(0))
}

export default initDefaultUsers
