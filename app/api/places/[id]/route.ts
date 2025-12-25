import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Place, { IPlace } from '@/lib/models/Place'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect()
        let place = await (Place as any).findById(params.id)

        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 })
        }

        return NextResponse.json(place)
    } catch (error) {
        console.error('Error fetching place:', error)
        return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 })
    }
}
