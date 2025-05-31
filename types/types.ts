export type TableColumn<T = unknown> = {
    name: string
    field: string
    icon?: React.ReactNode
    sortable?: boolean
    render?: (row: T) => React.ReactNode
}
