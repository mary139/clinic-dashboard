import StaffForm from '@/components/StaffForm'


const getStaff = async (id: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/staff/${id}`)
    if (!res.ok) throw new Error('Failed to fetch staff')
    return res.json()
}

export default async function EditStaffPage({ params }: { params: { id: string } }) {
    const id = (await params).id;
    const staff = await getStaff(id);

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Staff</h1>
            <StaffForm initialData={staff} />
        </div>
    )
}
