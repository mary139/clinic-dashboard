import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Staff } from '@/types/staff'

// Use Node.js runtime for file system access
// To overwrite JSON file
export const runtime = 'nodejs'

const filePath = path.join(process.cwd(), 'data/staff.json')

// GET: Fetch a single staff member by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const fileData = await fs.readFile(filePath, 'utf-8')
    const staffList: Staff[] = JSON.parse(fileData)

    const staff = staffList.find((s) => s.id.toString() === params.id)

    // Return 404 if not found
    if (!staff) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Return found staff member data
    return NextResponse.json(staff)
}

// PUT: Update a staff member by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    // Parse updated staff data from request body
    const updatedStaff = await req.json()

    // Read existing staff data from file
    const fileData = await fs.readFile(filePath, 'utf-8')
    const staffList: Staff[] = JSON.parse(fileData)

    // Find index of staff member to update
    const index = staffList.findIndex((s) => s.id.toString() === params.id)

    // Return 404 if staff not found
    if (index === -1) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Merge existing staff data with updated data
    staffList[index] = { ...staffList[index], ...updatedStaff }

    // Write updated staff list back to file
    await fs.writeFile(filePath, JSON.stringify(staffList, null, 2), 'utf-8')

    // Return success response with updated staff member
    return NextResponse.json({ success: true, staff: staffList[index] })
}
