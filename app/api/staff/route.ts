import { NextResponse, NextRequest } from 'next/server'
import { promises as fs } from 'fs'
// Import UUID for unique ID generation
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { Staff } from '@/types/staff'

// Ensure this runs in Node.js environment
// To overwrite JSON file
export const runtime = 'nodejs'

const filePath = path.join(process.cwd(), 'data/staff.json')

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.toLowerCase() ?? ''
    const fileData = await fs.readFile(filePath, 'utf-8')
    const staffList: Staff[] = JSON.parse(fileData)

    // Filter staff by fullName or position matching the search term
    const filtered = staffList.filter(
        (s) =>
            s.fullName.toLowerCase().includes(search) ||
            s.position.toLowerCase().includes(search)
    )

    return NextResponse.json(filtered)
}

export async function POST(request: Request) {
    const newStaff = await request.json()
    const fileData = await fs.readFile(filePath, 'utf-8')
    const staffList: Staff[] = JSON.parse(fileData)

    // Append new staff with generated unique ID
    const updatedStaffList = [...staffList, { ...newStaff, id: uuidv4() }]
    // Write updated data back to file
    await fs.writeFile(filePath, JSON.stringify(updatedStaffList, null, 2), 'utf-8')

    // Send success response
    return NextResponse.json({ success: true })
}
