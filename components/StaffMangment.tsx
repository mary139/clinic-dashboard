'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import SmartTable from '@/components/SmartTable'
import { Edit } from 'iconsax-reactjs'
import { TableColumn } from '@/types/types'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

type Staff = {
  id: number
  fullName: string
  position: string
  status: string
  hireDate: string
}

const columns: TableColumn<Staff>[] = [
  {
    name: 'Full Name',
    field: 'fullName',
    sortable: true,
  },
  {
    name: 'Position',
    field: 'position',
  },
  {
    name: 'Status',
    field: 'status',
    render: (row: Staff) => {
      const status = row.status.toLowerCase()
      let colorClass = ''
      let text = row.status

      if (status === 'active') {
        colorClass = 'bg-green-100 text-green-800'
      } else if (status === 'inactive') {
        colorClass = 'bg-red-100 text-red-800'
      } else if (status === 'on leave') {
        colorClass = 'bg-orange-100 text-orange-800'
      }

      return (
        <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold text-center ${colorClass} w-20`}>
          {text}
        </span>
      )
    }
  },
  {
    name: 'Hired Date',
    field: 'hireDate',
    sortable: true,
  },
  {
    name: '',
    field: 'actions',
    render: (row: Staff) => (
      <Link
        href={`/staff/edit/${row.id}`}
        className="text-gray-100 hover:text-gray-300 transition-colors flex justify-end"
      >
        <Edit size={18} />
      </Link>
    ),
  },
]

export default function StaffMangment() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 500)
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ field?: string; direction?: 'asc' | 'desc' }>({})


  const fetchStaff = async (query = '') => {
    try {
      setLoading(true)
      const res = await fetch(`/api/staff${!!query ? `?search=${encodeURIComponent(query)}` : ''}`)
      const data = await res.json()
      setStaff(data)
    } catch (err) {
      console.error('Failed to fetch staff:', err)
    } finally {
      setLoading(false)
    }
  }


  // Custom hook that returns a debounced version of a value.
  // It delays updating the debounced value until after a specified delay (in ms)
  // has passed since the last change, preventing excessive rapid updates.
  // Useful for optimizing expensive operations like API calls during user input.
  useEffect(() => {
    fetchStaff(debouncedSearch)
  }, [debouncedSearch])


  // Memoized sorting of staff data based on current sort configuration.
  // Sorts by the specified field in ascending or descending order.
  // Special handling for 'hireDate' field to ensure correct date comparison.
  const sortedStaff = useMemo(() => {
    if (!sortConfig.field) return staff

    const sorted = [...staff].sort((a, b) => {
      let aValue = a[sortConfig.field as keyof Staff]
      let bValue = b[sortConfig.field as keyof Staff]

      if (sortConfig.field === 'hireDate') {
        aValue = new Date(aValue as string)
        bValue = new Date(bValue as string)
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [staff, sortConfig])


  // Updates the sorting configuration when a sortable column header is clicked.
  // Toggles between ascending and descending if the same field is clicked consecutively.
  // Defaults to ascending order when switching to a new field.
  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        const newDirection = prev.direction === 'asc' ? 'desc' : 'asc'
        return { field, direction: newDirection }
      }
      return { field, direction: 'asc' }
    })
  }

  return (
    <SmartTable
      columns={columns}
      data={sortedStaff}
      withSearch
      searchValue={search}
      onSearchChange={(val) => {
        setSearch(val)
        setPage(1)
      }}
      page={page}
      onPageChange={setPage}
      totalCount={staff.length || 0}
      loading={loading}
      onSort={handleSort}
    />
  )
}
