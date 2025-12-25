import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Place from '@/lib/models/Place'

export async function GET() {
    try {
        await dbConnect()
        const places = await (Place as any).find({})
        return NextResponse.json(places)
    } catch (error) {
        console.error('Error fetching places:', error)
        return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 })
    }
}
