'use client'

import { useState } from 'react'
import { Grid3x3, List } from 'lucide-react'

interface AdvancedFiltersProps {
  onSortChange: (sort: 'price-low' | 'price-high' | 'newest') => void
  onCityChange: (city: string) => void
  onPropertyCategoryChange: (category: 'Residential' | 'Commercial') => void
  onTypeChange: (type: string) => void
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export default function AdvancedFilters({
  onSortChange,
  onCityChange,
  onPropertyCategoryChange,
  onTypeChange,
  onViewModeChange,
}: AdvancedFiltersProps) {
  const [sort, setSort] = useState<'price-low' | 'price-high' | 'newest'>('newest')
  const [city, setCity] = useState('All')
  const [propertyCategory, setPropertyCategory] = useState<'Residential' | 'Commercial'>('Residential')
  const [type, setType] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const residentialTypes = ['All', 'Single Room', "Rooms and Kitchen", '1BHK Flat', '2BHK Flat', '3BHK Flat', 'Full House']
  const commercialTypes = ['All', 'Office Spaces', 'Commercial Flats', 'Commercial Building', 'Truss Spaces', 'Land for Lease']
  const currentTypeOptions = propertyCategory === 'Residential' ? residentialTypes : commercialTypes

  const handleSortChange = (newSort: typeof sort) => {
    setSort(newSort)
    onSortChange(newSort)
  }

  const handleCityChange = (newCity: string) => {
    setCity(newCity)
    onCityChange(newCity)
  }

  const handlePropertyCategoryChange = (category: 'Residential' | 'Commercial') => {
    setPropertyCategory(category)
    setType('All')
    onPropertyCategoryChange(category)
    onTypeChange('All')
  }

  const handleTypeChange = (newType: string) => {
    setType(newType)
    onTypeChange(newType)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
    onViewModeChange(mode)
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Property Category Toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Category
            </label>
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1 bg-white">
              <button
                onClick={() => handlePropertyCategoryChange('Residential')}
                className={`cursor-pointer px-4 py-2 rounded font-medium transition-smooth ${
                  propertyCategory === 'Residential'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Residential
              </button>
              <button
                onClick={() => handlePropertyCategoryChange('Commercial')}
                className={`cursor-pointer px-4 py-2 rounded font-medium transition-smooth ${
                  propertyCategory === 'Commercial'
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Commercial
              </button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Sort
            </label>
            <select
              value={sort}
              onChange={(e) =>
                handleSortChange(
                  e.target.value as 'price-low' | 'price-high' | 'newest',
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 transition-smooth hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* City Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">
              City
            </label>
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 transition-smooth hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="All">All Cities</option>
              <option value="Bhairahawa">Bhairahawa</option>
              <option value="Butwal">Butwal</option>
              <option value="Yogikuti">Yogikuti</option>
            </select>
          </div>

          {/* Property Type Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-900 transition-smooth hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {currentTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Mode Toggle */}
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1 bg-white">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`cursor-pointer p-2 rounded transition-smooth ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid View"
            >
              <Grid3x3 size={18} />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`cursor-pointer p-2 rounded transition-smooth ${
                viewMode === 'list'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
