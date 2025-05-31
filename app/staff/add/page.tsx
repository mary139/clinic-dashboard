'use client'

import StaffForm from '@/components/StaffForm'
import { useRouter } from 'next/navigation'

export default function AddStaffPage() {
    const router = useRouter()

    const handleSubmit = async (staff: any) => {
        const res = await fetch('/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staff),
        })

        if (res.ok) {
            router.push('/')
        } else {
            alert('Failed to add staff')
        }
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Staff</h1>
            <StaffForm onSubmit={handleSubmit} />
        </div>
    )
}
