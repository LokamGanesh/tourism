import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API is working',
    env: {
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ? 'Set' : 'Missing',
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ? 'Set' : 'Missing',
      twilioVerifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID ? 'Set' : 'Missing',
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER ? 'Set' : 'Missing',
      mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Missing'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    return NextResponse.json({
      success: true,
      message: 'POST request received',
      receivedData: body
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to parse JSON',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}
