'use client'

import { useState, useRef, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import { countryList, type Country } from '@/data/countries'

interface SearchSectionProps {
  onCountrySelect?: (country: Country) => void
  placeholder?: string
}

export const SearchSection = ({ onCountrySelect, placeholder = 'Search for countries...' }: SearchSectionProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = countryList
        .filter(
          country =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 8) // Show max 8 results

      setFilteredCountries(filtered)
      setIsDropdownOpen(true)
      setHighlightedIndex(-1)
    } else {
      setFilteredCountries([])
      setIsDropdownOpen(false)
    }
  }, [searchTerm])

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
    if (!isDropdownOpen || filteredCountries.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < filteredCountries.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredCountries.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleCountrySelect(filteredCountries[highlightedIndex])
        }
        break
      case 'Escape':
        setIsDropdownOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleCountrySelect = (country: Country) => {
    setSearchTerm(country.name)
    setIsDropdownOpen(false)
    setHighlightedIndex(-1)
    onCountrySelect?.(country)
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

        {/* Dropdown Results */}
        {isDropdownOpen && filteredCountries.length > 0 && (
          <div
            className='absolute z-50 w-full mt-1 bg-white border border-gray-200
                        rounded-xl shadow-lg max-h-64 overflow-y-auto'
          >
            {filteredCountries.map((country, index) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country)}
                className={`bg-backgroundPaper cursor-pointer  w-full px-4 py-3 text-left flex items-center gap-3
                          hover:bg-gray-50 transition-colors duration-150
                          ${index === highlightedIndex ? 'bg-primary bg-opacity-10' : ''}
                          ${index === 0 ? 'rounded-t-xl' : ''}
                          ${index === filteredCountries.length - 1 ? 'rounded-b-xl' : ''}
                          border-b border-gray-100 last:border-b-0`}
              >
                {/* Country Flag */}
                <span
                  className={`fi fi-${country.code.toLowerCase()} text-lg`}
                  style={{ width: '24px', height: '18px' }}
                />

                {/* Country Info */}
                <div className='flex-1 min-w-0'>
                  <div className='font-medium text-gray-900 truncate'>{country.name}</div>
                  <div className='text-sm text-gray-500'>
                    {country.code} • {country.region}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isDropdownOpen && searchTerm && filteredCountries.length === 0 && (
          <div
            className='absolute z-50 w-full mt-1 bg-white border border-gray-200
                        rounded-xl shadow-lg p-4 text-center text-gray-500'
          >
            No countries found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  )
}
