const fs = require('fs')
const path = require('path')

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('✅ Created uploads directory at:', uploadsDir)
} else {
  console.log('✅ Uploads directory already exists')
}

// Create a .gitkeep file to ensure the directory is tracked
const gitkeepPath = path.join(uploadsDir, '.gitkeep')
if (!fs.existsSync(gitkeepPath)) {
  fs.writeFileSync(gitkeepPath, '')
  console.log('✅ Created .gitkeep file')
}

console.log('\n🎉 Setup complete! You can now upload images through the admin dashboard.')
