'use client'

import { useEffect, useMemo, useState } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import type { TextFieldProps } from '@mui/material/TextField'
import { Icon } from '@iconify/react'
import CustomAvatar from '@core/components/mui/Avatar'

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
import api from '@/utils/api'
import { customLog } from '@/utils/commons'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import tableStyles from '@core/styles/table.module.css'
import AddCategoryDrawer from './AddCategoryDrawer'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type categoryType = {
  _id: string
  title: string
  description: string
  icon: string
  image: string
  comment: string
  status: string
}

type CategoryWithActionsType = categoryType & {
  actions?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

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
  }, [value, debounce, onChange])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const columnHelper = createColumnHelper<CategoryWithActionsType>()

const ArticleCategoryTable = () => {
  const [addCategoryOpen, setAddCategoryOpen] = useState(false)
  const [data, setData] = useState<categoryType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<categoryType | null>(null)

  const fetchCategories = async () => {
    try {
      const response = await api.get('/help-center/categories')
      customLog('Fetched categories:', response.data)
      setData(response.data)
    } catch (error: any) {
      console.error('Error fetching categories:', error.message)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const refreshCategories = () => {
    fetchCategories()
  }

  const columns = useMemo<ColumnDef<CategoryWithActionsType, any>[]>(
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

      columnHelper.accessor('title', {
        header: 'Categories',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            {row.original.icon ? (
              <div
                className='rounded-md flex items-center justify-center bg-actionHover text-primary'
                style={{
                  width: 38,
                  height: 38,
                  minWidth: 38
                }}
              >
                <Icon icon={row.original.icon} fontSize={24} />
              </div>
            ) : (
              <img
                src={row.original.image}
                width={38}
                height={38}
                className='rounded-md bg-actionHover object-cover'
                alt={row.original.title}
              />
            )}

            <div className='flex flex-col items-start'>
              <Typography className='font-medium' color='text.primary'>
                {row.original.title}
              </Typography>
              <Typography variant='body2'>{row.original.description}</Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              size='small'
              onClick={() => {
                setEditingCategory(row.original)
                setAddCategoryOpen(true)
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
                      setSelectedCategoryId(row.original._id)
                      setDeleteDialogOpen(true)
                    }
                  }
                }
              ]}
            />
          </div>
        ),
        enableSorting: false
      })
    ],
    []
  )

  const table = useReactTable({
    data: data as CategoryWithActionsType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
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

  const handleDeleteConfirm = async () => {
    if (!selectedCategoryId) return
    try {
      await api.delete(`/help-center/categories/${selectedCategoryId}`)
      setData(current => current.filter(category => category._id !== selectedCategoryId))
      customLog('Category deleted:', selectedCategoryId)
      toast.success('Category deleted successfully')
    } catch (error: any) {
      console.error('Error deleting category:', error.message)
      toast.error('Error deleting category: ' + error.message)
    }
    setDeleteDialogOpen(false)
    setSelectedCategoryId(null)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedCategoryId(null)
  }

  return (
    <>
      <Card>
        <div className='flex items-start justify-between max-sm:flex-col sm:items-center gap-y-4 p-5'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
            className='max-sm:is-full'
          />
          <div className='flex items-center max-sm:flex-col gap-4 max-sm:is-full'>
            <Button
              variant='contained'
              className='max-sm:is-full is-auto'
              onClick={() => {
                setEditingCategory(null)
                setAddCategoryOpen(true)
              }}
              startIcon={<i className='ri-add-line' />}
            >
              Add Category
            </Button>
          </div>
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
                          {header.column.getIsSorted() === 'asc' ? (
                            <i className='ri-arrow-up-s-line text-xl' />
                          ) : header.column.getIsSorted() === 'desc' ? (
                            <i className='ri-arrow-down-s-line text-xl' />
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AddCategoryDrawer
        open={addCategoryOpen}
        handleClose={() => {
          setAddCategoryOpen(false)
          setEditingCategory(null)
        }}
        refreshCategories={refreshCategories}
        initData={editingCategory || undefined}
      />
    </>
  )
}

export default ArticleCategoryTable
