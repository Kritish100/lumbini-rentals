'use client'

import { Grid3x3, List } from 'lucide-react'
import { useState } from 'react'

interface FilterPillProps {
  onLocationChange?: (location: string) => void
  onTypeChange?: (type: string) => void
  onViewChange?: (view: 'grid' | 'list') => void
}

export default function FilterPill({
  onLocationChange,
  onTypeChange,
  onViewChange,
}: FilterPillProps) {
  const [location, setLocation] = useState('All')
  const [type, setType] = useState('All')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const locations = ['All', 'Butwal', 'Bhairahawa', 'Yogikuti']
  const types = ['All', 'Single Room', '1BHK', '2BHK', 'Commercial']

  const handleLocationChange = (loc: string) => {
    setLocation(loc)
    onLocationChange?.(loc)
  }

  const handleTypeChange = (t: string) => {
    setType(t)
    onTypeChange?.(t)
  }

  const handleViewChange = () => {
    const newView = view === 'grid' ? 'list' : 'grid'
    setView(newView)
    onViewChange?.(newView)
  }

  return (
    <div className="sticky top-[64px] z-30 w-full bg-white border-b border-slate-200">
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
        {/* Location Dropdown */}
        <select
          value={location}
          onChange={(e) => handleLocationChange(e.target.value)}
          className="px-3 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-slate-400"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Type Dropdown */}
        <select
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="px-3 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-slate-400"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* View Toggle */}
        <button
          onClick={handleViewChange}
          className="ml-auto flex items-center justify-center w-10 h-10 text-slate-900 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
          aria-label="Toggle view"
        >
          {view === 'grid' ? (
            <Grid3x3 size={20} />
          ) : (
            <List size={20} />
          )}
        </button>
      </div>
    </div>
  )
}
