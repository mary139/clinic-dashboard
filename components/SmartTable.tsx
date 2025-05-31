"use client"

import { TableColumn } from "@/types/types"
import { useMemo } from "react"
import { SearchNormal1, ArrowLeft2, ArrowRight2 } from "iconsax-reactjs"


interface TableComponentProps<T extends Record<string, unknown>> {
    columns: TableColumn<T>[]
    data: T[]
    loading?: boolean
    withSearch?: boolean
    searchValue?: string
    onSearchChange?: (search: string) => void
    page?: number
    pageSize?: number
    totalCount?: number
    totalPages?: number
    onPageChange?: (page: number) => void
    searchPlaceholder?: string
    actions?: (row: T) => React.ReactNode
    onSort?: (field: string) => void
}

// A reusable, generic table component with optional search, pagination, and customizable columns/actions.
// Supports loading state and sorting UI.
export default function SmartTable<T extends Record<string, unknown>>({
    columns = [],
    data = [],
    loading = false,
    withSearch = false,
    searchValue = '',
    onSearchChange,
    page = 1,
    pageSize = 8,
    totalCount = 0,
    totalPages,
    onPageChange,
    searchPlaceholder = 'Search',
    actions,
    onSort,
}: TableComponentProps<T>) {
    const handleSort = (field: string) => {
        if (onSort) {
            onSort(field)
        }
    }

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize
        return data.slice(start, start + pageSize)
    }, [data, page, pageSize])

    const calculatedTotalPages = useMemo(() => {
        return Math.ceil((totalCount || data.length) / pageSize)
    }, [data.length, pageSize, totalCount])

    const pagesToRender = totalPages || calculatedTotalPages

    return (
        <>
            {withSearch && (
                <div className="flex justify-center md:justify-start mt-8 mb-3">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <SearchNormal1 size="16" />
                        </div>
                        <input
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            type="text"
                            id="table-search"
                            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-80 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
                    </div>
                </div>
            )}
            <div className="overflow-x-auto w-full rounded-md">
                <table className="min-w-full w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {columns.map((col, idx) => {
                                const cellProps: Record<string, unknown> = {
                                    cursor: col.sortable ? 'pointer' : 'default',
                                    onClick: col.sortable ? () => handleSort(col.field) : undefined,
                                }
                                return (
                                    <th scope="col" className="px-3 md:px-6 py-7" key={col.field + idx} {...cellProps}>
                                        <div className="flex items-center">
                                            {col.name}
                                            {col.sortable && (
                                                <a href="#">
                                                    <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    {columns.map((col) => (
                                        <td key={col.field} className="px-6 py-6">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 w-3/4"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            paginatedData.map((row, idx) => (
                                <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    {columns.map((col, cidx) => {
                                        const cellProps: Record<string, unknown> = {}
                                        return (
                                            <td
                                                key={col.field + cidx}
                                                {...cellProps}
                                                className="px-3 md:px-6 py-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {col.render
                                                    ? col.render(row)
                                                    : col.field === 'actions' && actions
                                                        ? actions(row)
                                                        : String(row[col.field] || '')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <nav className="flex items-center flex-column flex-wrap md:flex-row justify-center pt-4" aria-label="Table navigation">
                <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                    <li>
                        <button
                            disabled={page === 1}
                            onClick={() => onPageChange && onPageChange(page - 1)}
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight border border-gray-300 rounded-s-lg
            ${page === 1
                                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-900 dark:text-gray-600 dark:border-gray-800'
                                    : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                }
        `}
                        >
                            <ArrowLeft2
                                size="16"
                            />
                        </button>
                    </li>
                    {Array.from({ length: pagesToRender }).map((_, i) => (
                        <li key={i}>
                            <button
                                onClick={() => onPageChange && onPageChange(i + 1)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 ${page === i + 1
                                    ? 'bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white border-gray-700'
                                    : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                    }`}
                            >{i + 1}</button>
                        </li>
                    ))}
                    <li>
                        <button
                            disabled={page === pagesToRender}
                            onClick={() => onPageChange && onPageChange(page + 1)}
                            className={`flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg
            ${page === pagesToRender
                                    ? 'text-gray-300 bg-gray-100 cursor-not-allowed dark:bg-gray-900 dark:text-gray-600 dark:border-gray-800'
                                    : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                                }
        `}
                        >
                            <ArrowRight2
                                size="16"
                            />
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    )
}
