'use client'

import { useState, useRef, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { countryList, type Country } from '@/data/countries'
import { EsimTabTypeEnum } from '../type'
import { useT } from '@/i18n/client'

interface SearchSectionProps {
  onSelect?: (option: { type: 'country' | 'region'; name: string; code?: string }) => void
  placeholder?: string
  activeTab: EsimTabTypeEnum
}

export const SearchSection = ({ onSelect, placeholder = 'Search for countries...', activeTab }: SearchSectionProps) => {
  const { t } = useT('esim')
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [options, setOptions] = useState<Array<{ type: 'country' | 'region'; name: string; code?: string }>>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) {
      setOptions([])
      setIsDropdownOpen(false)
      setHighlightedIndex(-1)
      return
    }

    if (activeTab === EsimTabTypeEnum.REGIONAL) {
      const REGIONS = ['North-America', 'Asia-Pacific', 'Europe', 'Latin America', 'Middle East', 'Oceania']
      const filtered = REGIONS.filter(r => r.toLowerCase().includes(term))
        .slice(0, 8)
        .map(r => ({ type: 'region' as const, name: r }))
      setOptions(filtered)
    } else {
      const filtered = countryList
        .filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
        .slice(0, 8)
        .map(c => ({ type: 'country' as const, name: c.name, code: c.code }))
      setOptions(filtered)
    }

    setIsDropdownOpen(true)
    setHighlightedIndex(-1)
  }, [searchTerm, activeTab])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const listLength = options.length
    if (!isDropdownOpen || listLength === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < listLength - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : listLength - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          const chosen = options[highlightedIndex]
          if (chosen) handleSelect(chosen)
        }
        break
      case 'Escape':
        setIsDropdownOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSelect = (opt: { type: 'country' | 'region'; name: string; code?: string }) => {
    setSearchTerm(opt.name)
    setIsDropdownOpen(false)
    setHighlightedIndex(-1)
    onSelect?.(opt)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setIsDropdownOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <div ref={searchRef} className='relative'>
        {/* Search Input */}
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <SearchIcon className='h-5 w-5 text-gray-400' />
          </div>

          <input
            ref={inputRef}
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchTerm && setIsDropdownOpen(true)}
            placeholder={placeholder}
            className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     bg-white shadow-sm transition-all duration-200
                     hover:border-gray-400'
          />

          {searchTerm && (
            <button
              onClick={clearSearch}
              className='bg-transparent cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center
                       hover:text-gray-600 transition-colors duration-200'
            >
              <ClearIcon className='h-5 w-5 text-gray-400' />
            </button>
          )}
        </div>

        {isDropdownOpen && options.length > 0 && (
          <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto'>
            {options.map((opt, index) => (
              <button
                key={`${opt.type}-${opt.code || opt.name}`}
                onClick={() => handleSelect(opt)}
                className={`bg-backgroundPaper cursor-pointer  w-full px-4 py-3 text-left flex items-center gap-3
                          hover:bg-gray-50 transition-colors duration-150
                          ${index === highlightedIndex ? 'bg-primary bg-opacity-10' : ''}
                          ${index === 0 ? 'rounded-t-xl' : ''}
                          ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                          border-b border-gray-100 last:border-b-0`}
              >
                {opt.type === 'country' ? (
                  <span
                    className={`fi fi-${opt.code?.toLowerCase()} text-lg`}
                    style={{ width: '24px', height: '18px' }}
                  />
                ) : (
                  <span className='text-lg'>🌐</span>
                )}
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-gray-900 truncate'>{opt.name}</div>
                  <div className='text-sm text-gray-500'>
                    {opt.type === 'country' ? opt.code : t('buy.regionLabel')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isDropdownOpen && searchTerm && options.length === 0 && (
          <div
            className='absolute z-50 w-full mt-1 bg-white border border-gray-200
                        rounded-xl shadow-lg p-4 text-center text-gray-500'
          >
            {t('buy.noResults', { term: searchTerm })}
          </div>
        )}
      </div>
    </div>
  )
}
