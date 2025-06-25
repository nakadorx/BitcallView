'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import {
  Card,
  CardHeader,
  Button,
  Chip,
  Checkbox,
  Divider,
  IconButton,
  TablePagination,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'

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
import { toast } from 'react-toastify'
import EditArticleModal from '../edit/EditArticleModal'
import CustomAvatar from '@core/components/mui/Avatar'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type Article = {
  _id: string
  title: string
  slug: string
  date: string
  icon?: string
  mainImage: string
  status: {
    status: string
    scheduledDateTime?: string
  }
  category: {
    _id: string
    title: string
    image: string
  }
  createdAt: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const truncateTitle = (title: string | Record<string, string>, maxWords: number, locale: string = 'en'): string => {
  const localized = typeof title === 'object' ? title[locale] || Object.values(title)[0] || '' : title || ''
  const words = localized.split(' ')
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : localized
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
  useEffect(() => setValue(initialValue), [initialValue])
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)
    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])
  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

const columnHelper = createColumnHelper<Article>()

const ArticleListTable = () => {
  const getLocalizedText = (value: string | Record<string, string>, locale: string = 'en'): string => {
    if (typeof value === 'object') {
      return value[locale] || value.en || Object.values(value)[0] || ''
    }
    return value
  }

  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Article[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)

  const { lang: locale } = useParams()

  useEffect(() => {
    api
      .get('/help-center/articles')
      .then(res => {
        customLog('Fetched articles:', res.data)
        setData(res.data)
      })
      .catch(err => console.error('Error fetching articles:', err))
  }, [])

  useEffect(() => {
    if (selectedStatus) {
      const filtered = data.filter(article => article.status?.status.toLowerCase() === selectedStatus.toLowerCase())
      setData(filtered)
    }
  }, [selectedStatus])

  const columns = useMemo<ColumnDef<Article, any>[]>(
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
        header: 'Title',
        cell: info => {
          const article = info.row.original
          return (
            <div className='flex items-center gap-3'>
              {article.icon ? (
                <CustomAvatar skin='light' color='primary' size={38} variant='rounded'>
                  <Icon icon={article.icon} width={22} height={22} />
                </CustomAvatar>
              ) : article.mainImage ? (
                <img
                  src={article.mainImage}
                  width={38}
                  height={38}
                  className='rounded-md bg-actionHover'
                  alt='Article'
                />
              ) : (
                <div className='w-[38px] h-[38px] rounded-md bg-muted'></div>
              )}
              <Typography>{truncateTitle(info.getValue(), 5, locale as string)}</Typography>
            </div>
          )
        }
      }),
      columnHelper.accessor(article => article.createdAt, {
        id: 'date',
        header: 'Created At',
        cell: info => <Typography>{new Date(info.getValue()).toLocaleString()}</Typography>
      }),
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
      // Category Column Updated
      columnHelper.accessor(article => article.category?.title || 'N/A', {
        id: 'category',
        header: 'Category',
        cell: info => {
          const category = info.row.original.category
          const icon = (category as any)?.icon // If your category includes an `icon` field

          return (
            <div className='flex items-center gap-2'>
              {icon ? (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    backgroundColor: 'var(--mui-palette-action-hover)'
                  }}
                >
                  <Icon icon={icon} width={18} height={18} />
                </div>
              ) : category?.image ? (
                <img
                  src={category.image}
                  alt={category.title}
                  width={30}
                  height={30}
                  className='rounded-full object-cover'
                />
              ) : (
                <div className='w-[30px] h-[30px] rounded-full bg-muted'></div>
              )}
              <Typography>{info.getValue()}</Typography>
            </div>
          )
        }
      }),
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton
              size='small'
              onClick={() => {
                customLog('Editing article:', row.original)
                setEditingArticle(row.original)
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
                      setArticleToDelete(row.original)
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
    []
  )

  const table = useReactTable({
    data,
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

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return
    try {
      await api.delete(`/help-center/articles/${articleToDelete._id}`)
      setData(current => current.filter(article => article._id !== articleToDelete._id))
      toast.success(`Article "${getLocalizedText(articleToDelete.title, locale as string)}" deleted successfully`)
    } catch (err) {
      toast.error('Error deleting article')
    }
    setDeleteModalOpen(false)
    setArticleToDelete(null)
  }

  return (
    <>
      <Card>
        <CardHeader title='Articles' />
        <Divider />
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-5'>
          <DebouncedInput
            value={globalFilter}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Articles'
            className='max-sm:is-full'
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id='article-status-select'>Status</InputLabel>
            <Select
              labelId='article-status-select'
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              label='Status'
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
            href={getLocalizedUrl('/apps/help-center/posts/add', locale as string)}
            startIcon={<i className='ri-add-line' />}
            className='max-sm:is-full'
          >
            Add Article
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
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
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

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete article "{getLocalizedText(articleToDelete?.title, locale as string)}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color='error'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {editModalOpen && editingArticle && (
        <EditArticleModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setEditingArticle(null)
          }}
          initData={editingArticle}
        />
      )}
    </>
  )
}

export default ArticleListTable
