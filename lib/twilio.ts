import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

console.log('Twilio config check:', {
  accountSid: accountSid ? 'Set' : 'Missing',
  authToken: authToken ? 'Set' : 'Missing',
  serviceSid: serviceSid ? 'Set' : 'Missing'
})

if (!accountSid || !authToken) {
  console.error('Missing required Twilio credentials')
  throw new Error('Missing Twilio credentials in environment variables')
}

const client = twilio(accountSid, authToken)

export const sendOTP = async (mobile: string): Promise<boolean> => {
  if (!serviceSid) {
    console.log('Verify Service SID not configured, skipping Twilio Verify Service')
    return false
  }
  
  try {
    console.log('Attempting to send OTP via Twilio Verify Service to:', mobile)
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: mobile,
        channel: 'sms'
      })
    
    console.log('Twilio Verify response:', verification.status)
    return verification.status === 'pending'
  } catch (error) {
    console.error('Error sending OTP via Verify Service:', error)
    return false
  }
}

export const verifyOTP = async (mobile: string, code: string): Promise<boolean> => {
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: mobile,
        code: code
      })
    
    return verificationCheck.status === 'approved'
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return false
  }
}

// Alternative manual OTP generation (if you prefer not to use Twilio Verify Service)
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendManualOTP = async (mobile: string, otp: string): Promise<boolean> => {
  try {
    const message = await client.messages.create({
      body: `Your Jharkhand Tourism verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile
    })
    
    return message.sid ? true : false
  } catch (error) {
    console.error('Error sending manual OTP:', error)
    return false
  }
}
