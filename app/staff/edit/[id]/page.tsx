'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import StaffForm from '@/components/StaffForm'
import { toast } from 'sonner'

export default function EditStaffPage() {
    const { id } = useParams()
    const router = useRouter()
    const [initialData, setInitialData] = useState(null)
    const hasErrorShownRef = useRef(false)

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await fetch(`/api/staff/${id}`)
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                setInitialData(data)
            } catch (error) {
                if (!hasErrorShownRef.current) {
                    toast.error('Failed to load staff data. Try agian!')
                    hasErrorShownRef.current = true
                    router.push('/')
                }
            }
        }

        if (id) fetchStaff()
    }, [id, router])

    const handleSubmit = async (staff: any) => {
        const res = await fetch(`/api/staff/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staff),
        })

        if (res.ok) {
            toast.success('Staff updated successfully!')
            router.push('/')
        } else {
            toast.error('Failed to update staff')
        }
    }

    if (!initialData) return <p>Loading...</p>

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Staff</h1>
            <StaffForm onSubmit={handleSubmit} initialData={initialData} />
        </div>
    )
}
