'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin, DollarSign, Search, Edit, ExternalLink, Trash2,
  Layers, LayoutGrid, List as ListIcon, PanelLeftClose, PanelLeftOpen,
  ImagePlus, CalendarDays
} from 'lucide-react'
import type { AdminProperty } from '@/app/admin/types'

interface PropertyListProps {
  properties: AdminProperty[]
  isPropertiesLoading: boolean
  refetchProperties: () => void
  toggleNegotiable: (id: string, value: boolean) => void
  toggleArchive: (id: string, value: boolean) => void
  
  isSidebarOpen: boolean
  resetPage: () =>  void
  setEditingId: (id: string) => void
  toggleSidebar: () => void
}

export default function PropertyList({
  properties,
  isPropertiesLoading,
  isSidebarOpen,
  refetchProperties,
  toggleArchive,
  toggleNegotiable,
  setEditingId,
  resetPage,
  toggleSidebar
}: PropertyListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterArchived, setFilterArchived] = useState('Active Only')
  const [filterLocation, setFilterLocation] = useState('All')
  const [sortOrder, setSortOrder] = useState('Newest')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Tracks which card should be highlighted after Edit/Media click
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  useEffect(() => {
    if (!highlightedId) return
    const timer = setTimeout(() => setHighlightedId(null), 2500)
    return () => clearTimeout(timer)
  }, [highlightedId])

  const handleEditClick = (item: AdminProperty) => {
    setHighlightedId(item.id)
  }

  const handleManageAssetsClick = (id: string) => {
    setHighlightedId(id)
  }

  const onToggleNegotiable = (id: string, value: boolean) => {
    toggleNegotiable(id, value)
  }

  const onToggleArchive = (id: string, value: boolean) => {
    toggleArchive(id, value)
  }

  const onDelete = (id: string) => {}

  const formatDate = (value?: string) => {
    if (!value) return null
    const d = new Date(value)
    if (isNaN(d.getTime())) return null
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const filteredAndSortedProperties = useMemo(() => {
    return properties
      
  }, [properties, searchTerm, filterCategory, filterLocation, filterArchived, sortOrder])


  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-orange-500 transition-colors shadow-sm"
          title={isSidebarOpen ? "Collapse Input Form" : "Expand Input Form"}
        >
          {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>

        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search title or ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900"
          />
        </div>

        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium">
          <option value="All">All Categories</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>

        <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium">
          <option value="All">All Locations</option>
          <option value="Butwal">Butwal</option>
          <option value="Bhairahawa">Bhairahawa</option>
        </select>

        <select value={filterArchived} onChange={e => setFilterArchived(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium">
          <option value="Active Only">Active Only</option>
          <option value="Archived">Archived</option>
          <option value="All">Show All</option>
        </select>

        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium">
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}><ListIcon size={16} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={16} /></button>
        </div>
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-slate-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Live Active Catalog</h2>
        </div>
        <span className="text-xs bg-slate-200 font-bold px-2.5 py-1 text-slate-600 rounded-md">
          {filteredAndSortedProperties.length} Results
        </span>
      </div>

      {isPropertiesLoading && (
        <>Loading ...</>
      )}

      {/* Properties Display */}
      {!isPropertiesLoading && filteredAndSortedProperties.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
          {filteredAndSortedProperties.map((item) => {
            const isHighlighted = highlightedId === item.id
            const createdLabel = formatDate((item as any).createdAt)

            return (
              <div
                key={item.id}
                id={`property-${item.id}`}
                className={`bg-white p-4 rounded-xl border shadow-sm transition-all duration-300 flex
                  ${viewMode === 'grid' ? 'flex-col' : 'items-center justify-between gap-4'}
                  ${item.isArchived ? 'opacity-60 grayscale' : ''}
                  ${isHighlighted
                    ? 'border-orange-400 ring-4 ring-orange-100 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'}
                `}
              >
                <div className={`flex ${viewMode === 'grid' ? 'flex-col gap-3' : 'items-center gap-4'} min-w-0 flex-1`}>
                  <img
                    src={item.assets?.[0] || 'https://via.placeholder.com/150'}
                    alt={item.title}
                    className={`${viewMode === 'grid' ? 'w-full h-32' : 'w-16 h-16'} rounded-lg object-cover bg-slate-100 flex-shrink-0`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-800 truncate">{item.title}</h3>
                      <span className="bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">{item.id}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-0.5 text-slate-600 font-semibold"><MapPin size={12} className="text-orange-500" /> {item.location}, {item.subLocation}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{Array.isArray(item.category) ? item.category?.join(', ') : null}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                        {item.status}
                      </span>
                      {createdLabel && (
                        <span className="flex items-center gap-1 text-slate-400 font-medium">
                          <CalendarDays size={12} /> {createdLabel}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-sm font-extrabold text-slate-900 flex items-center">
                      <DollarSign size={13} className="text-slate-400 -mr-0.5" />{item.price.toLocaleString()}
                    </div>

                    {/* NEW: Checkbox row for Negotiable / Archived */}
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked={item.isNegotiable}
                          onChange={(e) => onToggleNegotiable(item.id, e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                        />
                        Negotiable
                      </label>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          defaultChecked={item.isArchived}
                          onChange={(e) => onToggleArchive(item.id, e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                        />
                        Archived
                      </label>
                    </div>
                  </div>
                </div>

                <div className={`flex items-center gap-2 flex-shrink-0 flex-wrap ${viewMode === 'grid' ? 'mt-3 justify-end pt-3 border-t border-slate-100' : ''}`}>
                  {/* PROMINENT MANAGE ASSETS BUTTON */}
                  <button
                    onClick={() => handleManageAssetsClick(item.id)}
                    className="px-3 py-2 rounded-lg text-white bg-slate-900 hover:bg-orange-500 transition-colors shadow-sm flex items-center gap-1.5"
                    title="Manage Media & Assets"
                  >
                    <ImagePlus size={16} />
                    <span className="text-xs font-bold">Media</span>
                  </button>

                  <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                  <Link href={`/?view=${item.id}`} target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="View on Public Site">
                    <ExternalLink size={16} />
                  </Link>

                  <button onClick={() => handleEditClick(item)} className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors" title="Edit Listing">
                    <Edit size={16} />
                  </button>

                  <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete Property">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {!isPropertiesLoading && !filteredAndSortedProperties.length && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
          No properties match your current filters.
        </div>
      )}
    </div>
  )
}