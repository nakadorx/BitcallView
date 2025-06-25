// React Imports
import { useRef, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import MuiTextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'

// Third-party Imports
import classnames from 'classnames'

// Styles imports
import styles from './styles.module.css'

// Utils Imports
import { getLocale } from '@/utils/commons'
// Styled TextField component
const TextField = styled(MuiTextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--mui-palette-background-paper)'
  }
})

type Props = {
  searchValue: string
  setSearchValue: (value: string) => void
  blogs: any[] // Accept blogs for search suggestions
}

const HelpCenterHeader = ({ searchValue, setSearchValue, blogs }: Props) => {
  const locale = getLocale()
  // Ref to track the search box
  const searchRef = useRef<HTMLDivElement | null>(null)

  // Detect clicks outside and close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchValue('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setSearchValue])

  // Filter blogs based on search query
  const filteredBlogs = searchValue
    ? blogs.filter(blog =>
        [blog.title, blog.description, ...(blog.tags || [])].join(' ').toLowerCase().includes(searchValue.toLowerCase())
      )
    : []

  return (
    <section className={classnames('-mbs-[18%] sm:mbs-[-10%] lg:mbs-[-10%] md:mbs-[-8%]', styles.bgImage)}>
      <div
        className={classnames(
          'flex flex-col gap-2 items-center text-center pbs-[150px] lg:pbs-[180px] pbe-[40px] sm:pbe-[100px] pli-5'
        )}
      >
        <Typography variant='h4' color='primary'>
          Hello, how can we help?
        </Typography>

        {/* ✅ Wrap the search inside a ref */}
        <div ref={searchRef} className='relative w-full sm:max-w-[55%] md:max-w-[600px]'>
          <TextField
            className='w-full'
            variant='outlined'
            placeholder='Search by tags, title, description, or ask a question...'
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='ri-search-line' />
                </InputAdornment>
              ),
              endAdornment: searchValue && (
                <InputAdornment position='end'>
                  <IconButton onClick={() => setSearchValue('')} edge='end'>
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* ✅ Search Suggestions Dropdown */}
          {searchValue && filteredBlogs.length > 0 && (
            <Paper
              elevation={3}
              className='absolute left-0 right-0 mt-1 z-10 max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 shadow-lg'
              sx={{
                '&::-webkit-scrollbar': {
                  width: '5px'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#aaa',
                  borderRadius: '10px'
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent'
                }
              }}
            >
              <List>
                {filteredBlogs.slice(0, 30).map(blog => (
                  // eslint-disable-next-line lines-around-comment
                  // pass the
                  <ListItem
                    key={blog.id}
                    button
                    component={Link}
                    href={`/${locale}/blog/${blog.slug}`} // ✅ Dynamic blog link
                  >
                    <ListItemAvatar>
                      <Avatar src={blog.mainImage || '/images/blog-placeholder.png'} />
                    </ListItemAvatar>
                    <ListItemText primary={blog.title} secondary={blog.tags?.join(', ')} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </div>

        <Typography>or choose a category to quickly find the help you need</Typography>
      </div>
    </section>
  )
}

export default HelpCenterHeader
