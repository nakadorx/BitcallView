'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { TextFieldProps } from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useTheme } from '@mui/material'
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import OptionMenu from '@core/components/option-menu'
import { getLocalizedUrl } from '@/utils/i18n'
import api from '@/utils/api'
import tableStyles from '@core/styles/table.module.css'
import { customLog } from '@/utils/commons'
import EditBlogModal from '../edit/EditBlogModal'
import { toast } from 'react-toastify'

// Extend the table core types
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

// Define a BlogPost type based on your API response
type BlogPost = {
  _id: string
  title: string
  slug: string
  date: string
  mainImage: any
  status: {
    status: string
    scheduledDateTime?: string
  }
  author?: {
    name: string
  }
  actions?: string
}

// Fuzzy filter function for table filtering
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Helper function to truncate a title
const truncateTitle = (title: string | { [key: string]: string }, maxWords: number, locale = 'en'): string => {
  const localized = typeof title === 'object' ? title[locale] || Object.values(title)[0] || '' : title || ''
  const words = localized.split(' ')
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...'
  }
  return localized
}

// DebouncedInput component for search/filtering
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeout)
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const columnHelper = createColumnHelper<BlogPost>()

const BlogListTable = () => {
  const theme = useTheme()
  // Table and filter states
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<BlogPost[]>([])
  const [filteredData, setFilteredData] = useState<BlogPost[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // State to control the edit modal
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)

  // State for delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null)

  const { lang: locale } = useParams()

  // Fetch blogs from the admin endpoint on mount
  useEffect(() => {
    api
      .get('/blogs/admin')
      .then(res => {
        customLog('Response data:', res.data)
        const blogs: BlogPost[] = res.data.result.blogs || []
        setData(blogs)
        setFilteredData(blogs)
      })
      .catch(err => {
        console.error('Error fetching blogs:', err)
      })
  }, [])

  // New filter effect: update filteredData when selectedStatus changes
  useEffect(() => {
    if (!selectedStatus) {
      // If "All" is selected, display all data
      setFilteredData(data)
    } else {
      const filtered = data.filter(blog => {
        const blogStatus = blog.status?.status ?? ''
        return blogStatus.toLowerCase() === selectedStatus.toLowerCase()
      })
      setFilteredData(filtered)
    }
  }, [selectedStatus, data])

  // Table columns definition
  const columns = useMemo<ColumnDef<BlogPost, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },
      // Title column with blog mainImage and truncated title text
      columnHelper.accessor('title', {
        header: 'Title',
        cell: info => {
          const theme = useTheme() // Access theme inside cell
          const mainImage = info.row.original.mainImage
          const resolvedImage =
            typeof mainImage === 'object'
              ? theme.palette.mode === 'dark'
                ? mainImage.dark || mainImage.light
                : mainImage.light
              : mainImage

          return (
            <div className='flex items-center gap-3'>
              <img src={resolvedImage} width={38} height={38} className='rounded-md bg-actionHover' alt='Blog Main' />
              <Typography>{truncateTitle(info.getValue(), 4, locale)}</Typography>{' '}
            </div>
          )
        }
      }),
      // Date column shows full date and time
      columnHelper.accessor('date', {
        header: 'Date',
        cell: info => <Typography>{new Date(info.getValue()).toLocaleString()}</Typography>
      }),
      // Status column: if Scheduled, show scheduledDateTime in parentheses
      columnHelper.accessor('status.status', {
        header: 'Status',
        cell: info => {
          const status = info.getValue()
          if (status?.toLowerCase() === 'scheduled' && info.row.original.status.scheduledDateTime) {
            return (
              <Chip
                label={`${status} (${info.row.original.status.scheduledDateTime})`}
                variant='tonal'
                color='warning'
                size='small'
              />
            )
          }
          return (
            <Chip
              label={status || 'N/A'}
              variant='tonal'
              color={status?.toLowerCase() === 'published' ? 'success' : 'warning'}
              size='small'
            />
          )
        }
      }),
      // Actions column with Edit and Delete (with confirm modal)
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              size='small'
              onClick={() => {
                customLog('row.original selected: ', row.original)
                setEditingBlog(row.original)
                setEditModalOpen(true)
              }}
            >
              <i className='ri-edit-box-line text-[22px] text-textSecondary' />
            </IconButton>
            <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary text-[22px]'
              options={[
                {
                  text: 'Delete',
                  icon: 'ri-delete-bin-7-line',
                  menuItemProps: {
                    onClick: () => {
                      // Open the confirmation modal with the selected blog
                      setBlogToDelete(row.original)
                      setDeleteModalOpen(true)
                    }
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      }
    ],
    [data]
  )

  // Set up the table using TanStack React Table
  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  // Handle the delete confirmation
  const handleConfirmDelete = async () => {
    if (blogToDelete) {
      try {
        await api.delete(`/blogs/${blogToDelete._id}`)
        setData(data.filter(blog => blog._id !== blogToDelete._id))
        const localizedTitle =
          typeof blogToDelete.title === 'object'
            ? blogToDelete.title[locale as string] || blogToDelete.title.en || Object.values(blogToDelete.title)[0]
            : blogToDelete.title

        toast.success(`Blog "${localizedTitle}" deleted successfully`)
      } catch (err) {
        toast.error('Error deleting blog')
      }
      setDeleteModalOpen(false)
      setBlogToDelete(null)
    }
  }

  return (
    <>
      <Card>
        <CardHeader title='Blogs' />
        <Divider />
        {/* Global search and status filter controls */}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5'>
          <DebouncedInput
            value={globalFilter}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Blogs'
            className='max-sm:is-full'
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id='blog-status-select'>Status</InputLabel>
            <Select
              labelId='blog-status-select'
              id='select-blog-status'
              value={selectedStatus}
              label='Status'
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='published'>Published</MenuItem>
              <MenuItem value='scheduled'>Scheduled</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant='contained'
            component={Link}
            href={getLocalizedUrl('/apps/blog/posts/add', locale as string)}
            startIcon={<i className='ri-add-line' />}
            className='max-sm:is-full'
          >
            Add Blog Post
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <i className='ri-arrow-up-s-line text-xl' />,
                            desc: <i className='ri-arrow-down-s-line text-xl' />
                          }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      {/* Confirm Delete Modal */}
      {deleteModalOpen && blogToDelete && (
        <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete blog "
              {typeof blogToDelete.title === 'object'
                ? blogToDelete.title[locale as string] || blogToDelete.title.en
                : blogToDelete.title}
              "?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color='error'>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {editModalOpen && editingBlog && (
        <EditBlogModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingBlog(null)
          }}
          initData={editingBlog}
        />
      )}
    </>
  )
}

export default BlogListTable
