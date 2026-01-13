const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email configuration...\n');
  
  // Check environment variables
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✓ Set' : '✗ Not set');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Set' : '✗ Not set');
  console.log('');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not configured!');
    console.log('Please set EMAIL_USER and EMAIL_PASSWORD in your .env file');
    return;
  }
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    
    console.log('Testing connection...');
    await transporter.verify();
    console.log('✓ Email server connection successful!\n');
    
    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: {
        name: 'Jharkhand Tourism',
        address: process.env.EMAIL_USER,
      },
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email - Jharkhand Tourism',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from Jharkhand Tourism Platform.</p>
        <p>If you received this, your email configuration is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
    });
    
    console.log('✓ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nCheck your inbox at:', process.env.EMAIL_USER);
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error(error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Tip: For Gmail, you need to use an App Password:');
      console.log('1. Go to https://myaccount.google.com/apppasswords');
      console.log('2. Generate a new app password');
      console.log('3. Update EMAIL_PASSWORD in your .env file');
    }
  }
}

testEmail();
