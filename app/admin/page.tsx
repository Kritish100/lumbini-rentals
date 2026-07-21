'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, Trash2, Building2, MapPin, DollarSign, ArrowLeft, 
  Layers, CheckCircle2, Search, Edit, Archive, ExternalLink, 
  Image as ImageIcon, Video, X, LayoutGrid, List as ListIcon
} from 'lucide-react'
import AdminLogin from './components/AdminLogin';

// --- Types & Interfaces ---
interface DynamicField {
  id: string;
  key: string;
  value: string;
}

// Extending the base property type for Admin use
interface AdminProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  subLocation: string;
  googleMapUrl: string;
  longitude: string;
  latitude: string;
  categories: string[]; // e.g., ['Residential'], ['Commercial'], or both
  status: string;
  description: string;
  isNegotiable: boolean;
  isArchived: boolean;
  isActiveOffer: boolean;
  offerDescription: string;
  furnishingStatus: string;
  utilitiesIncluded: string;
  specifications: DynamicField[];
  basicAmenities: string;
  dynamicAmenities: DynamicField[];
  images: string[];
  videos: string[];
}

// Dummy initial data mapped to new structure
const INITIAL_PROPERTIES: AdminProperty[] = [
  {
    id: 'prop-1',
    title: 'Luxury 2BHK Flat near Highway',
    price: 15000,
    location: 'Butwal',
    subLocation: 'Yogikuti',
    googleMapUrl: '',
    longitude: '83.45',
    latitude: '27.68',
    categories: ['Residential'],
    status: 'Available',
    description: 'Beautiful flat with natural light.',
    isArchived: false,
    isActiveOffer: true,
    isNegotiable: true,
    offerDescription: '10% off first month',
    furnishingStatus: 'Semi-Furnished',
    utilitiesIncluded: 'Water',
    specifications: [],
    basicAmenities: 'Parking, WiFi',
    dynamicAmenities: [],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=200&fit=crop'],
    videos: []
  }
]

const DEFAULT_FORM_STATE = {
  title: '', googleMapUrl: '', location: '', subLocation: '',
  longitude: '', latitude: '', categories: [] as string[],
  status: 'Available' as string, description: '', price: '',
  isArchived: false, isActiveOffer: false, offerDescription: '',
  furnishingStatus: '', utilitiesIncluded: '',
  specifications: [] as DynamicField[],
  basicAmenities: '', dynamicAmenities: [] as DynamicField[],
  isNegotiable: false
}

export default function AdminDashboard() {
  const [properties, setProperties] = useState<AdminProperty[]>(INITIAL_PROPERTIES)
  const [statusMessage, setStatusMessage] = useState('')

  // Authorization
  const [isAuthorized, setIsAuthorized] = useState(false)

  // --- List View States ---
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterArchived, setFilterArchived] = useState('Active Only')
  const [filterPropertyType, setFilterPropertyType] = useState('Single Room')
  const [filterLocation, setFilterLocation] = useState('All')
  const [sortOrder, setSortOrder] = useState('Newest')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // --- Form & Step Management ---
  const [activeStep, setActiveStep] = useState<1 | 2>(1)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE)

  // --- Form Handlers ---
  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
      const exists = prev.categories.includes(cat)
      if (exists) return { ...prev, categories: prev.categories.filter(c => c !== cat) }
      return { ...prev, categories: [...prev.categories, cat] }
    })
  }

  const toggleIsNegotiable = (value: boolean) => {
    setFormData(prev => ({ ...prev, isNegotiable: value }))
  }

  // Dynamic Fields Handler
  const addDynamicField = (target: 'specifications' | 'dynamicAmenities') => {
    const newField = { id: Date.now().toString(), key: '', value: '' }
    setFormData(prev => ({ ...prev, [target]: [...prev[target], newField] }))
  }

  const updateDynamicField = (target: 'specifications' | 'dynamicAmenities', id: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [target]: prev[target].map(field => field.id === id ? { ...field, key, value } : field)
    }))
  }

  const removeDynamicField = (target: 'specifications' | 'dynamicAmenities', id: string) => {
    setFormData(prev => ({
      ...prev,
      [target]: prev[target].filter(field => field.id !== id)
    }))
  }

  // --- Submission Logic ---
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.price || formData.categories.length === 0) {
      alert('Title, Price, and at least one Category are required.')
      return
    }

    if (editingId) {
      // Update existing
      setProperties(prev => prev.map(p => p.id === editingId ? { ...p, ...formData, price: Number(formData.price) } : p))
      showBanner('Property details updated successfully!')
    } else {
      // Create new
      const newId = `prop-${Date.now()}`
      const newProp: AdminProperty = {
        ...formData, id: newId, price: Number(formData.price), images: [], videos: []
      }
      setProperties([newProp, ...properties])
      setEditingId(newId) // Set to editing mode for step 2
      showBanner('Property drafted! Proceed to upload assets.')
    }
    setActiveStep(2) // Move to Step 2 (Assets)
  }

  const handleStep2Submit = () => {
    // In reality, this hits the Cloudflare R2 API. For now, reset form.
    showBanner('Assets linked successfully. Listing is live!')
    resetForm()
  }

  const resetForm = () => {
    setFormData(DEFAULT_FORM_STATE)
    setEditingId(null)
    setActiveStep(1)
  }

  // --- Card Actions ---
  const handleEdit = (property: AdminProperty) => {
    setEditingId(property.id)
    setFormData({
      ...property,
      price: property.price.toString(),
      isNegotiable: property.isNegotiable
    })
    setActiveStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this property?')) {
      setProperties(properties.filter(p => p.id !== id))
      if (editingId === id) resetForm()
      showBanner('Property deleted.')
    }
  }

  const handleToggleArchive = (id: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, isArchived: !p.isArchived } : p))
  }

  const showBanner = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(''), 4000)
  }

  // --- Filtering & Sorting ---
  const filteredAndSortedProperties = useMemo(() => {
    return properties
      .filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCat = filterCategory === 'All' || p.categories.includes(filterCategory)
        const matchesLoc = filterLocation === 'All' || p.location === filterLocation
        const matchesArchived = filterArchived === 'All' ? true : filterArchived === 'Archived' ? p.isArchived : !p.isArchived
        return matchesSearch && matchesCat && matchesLoc && matchesArchived
      })
      .sort((a, b) => {
        if (sortOrder === 'Newest') return b.id.localeCompare(a.id)
        if (sortOrder === 'Oldest') return a.id.localeCompare(b.id)
        return 0
      })
  }, [properties, searchTerm, filterCategory, filterLocation, filterArchived, sortOrder])
  

  // ===================================
  // AUTHORIZATION CHECK
  // ===================================
  if(!isAuthorized) 
    return <AdminLogin onSuccess={() => setIsAuthorized(true)} />


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Top Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl text-white"><Building2 size={20} /></div>
            <div>
              <h1 className="text-md font-bold tracking-tight">Prime Rentals Admin</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Central Console</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-xs font-bold uppercase bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 transition-all text-slate-200">
            <ArrowLeft size={14} /> Public Site
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {statusMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald-600" /><span>{statusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: CREATION FORM */}
          <section className="xl:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-orange-500" />
                <h2 className="text-base font-bold uppercase tracking-wide text-slate-800">
                  {editingId ? 'Edit Listing' : 'Add New Listing'}
                </h2>
              </div>
              {editingId && (
                <button onClick={resetForm} className="text-xs font-bold text-slate-400 hover:text-slate-700 uppercase">Cancel Edit</button>
              )}
            </div>

            {/* STEP 1: PROPERTY DETAILS */}
            {activeStep === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-md">1. Basic Info</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Title <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} required className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50" />
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Property Type</label>
                      <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                        <option value="Available">1 BHK</option>
                        <option value="On Hold">2 BHK</option>
                        <option value="Booked">Single Room</option>
                      </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Category <span className="text-red-500">*</span></label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.categories.includes('Residential')} onChange={() => toggleCategory('Residential')} className="accent-slate-900 w-4 h-4" /> Residential</label>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.categories.includes('Commercial')} onChange={() => toggleCategory('Commercial')} className="accent-slate-900 w-4 h-4" /> Commercial</label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-2">Options <span className="text-red-500"></span></label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isNegotiable} onChange={() => toggleIsNegotiable(!formData.isNegotiable)} className="accent-slate-900 w-4 h-4" /> Negotiable</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
                      <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                        <option value="Available">Available</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Booked">Booked</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Price (NPR) <span className="text-red-500">*</span></label>
                      <input type="number" value={formData.price} onChange={e => handleInputChange('price', e.target.value)} required className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                    <textarea rows={3} value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Location</label>
                    <input type="text" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Sub Location</label>
                    <input type="text" value={formData.subLocation} onChange={e => handleInputChange('subLocation', e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Google Maps URL</label>
                    <input type="url" value={formData.googleMapUrl} onChange={e => handleInputChange('googleMapUrl', e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Latitude</label>
                      <input type="text" value={formData.latitude} onChange={e => handleInputChange('latitude', e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Longitude</label>
                      <input type="text" value={formData.longitude} onChange={e => handleInputChange('longitude', e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50" />
                    </div>
                  </div>

                  

                  
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={formData.isArchived} onChange={e => handleInputChange('isArchived', e.target.checked)} className="w-4 h-4 accent-slate-900" /> Archived</label>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={formData.isActiveOffer} onChange={e => handleInputChange('isActiveOffer', e.target.checked)} className="w-4 h-4 accent-orange-500" /> Active Offer</label>
                </div>

                {formData.isActiveOffer && (
                  <div>
                    <label className="block text-xs font-bold text-orange-600 mb-1">Offer Description</label>
                    <input type="text" value={formData.offerDescription} onChange={e => handleInputChange('offerDescription', e.target.value)} className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:border-orange-500 bg-orange-50/50" />
                  </div>
                )}

                {/* Specifications */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-md">2. Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Furnishing Status</label>
                      <input type="text" value={formData.furnishingStatus} onChange={e => handleInputChange('furnishingStatus', e.target.value)} placeholder="e.g. Semi-Furnished" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Utilities Included</label>
                      <input type="text" value={formData.utilitiesIncluded} onChange={e => handleInputChange('utilitiesIncluded', e.target.value)} placeholder="e.g. Water, Trash" className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50" />
                    </div>
                  </div>
                  
                  {/* Dynamic Specs */}
                  {formData.specifications.map((field) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <input type="text" placeholder="Key (e.g. Floor)" value={field.key} onChange={e => updateDynamicField('specifications', field.id, e.target.value, field.value)} className="w-1/3 text-sm px-3 py-2 rounded-lg border border-slate-200" />
                      <input type="text" placeholder="Value (e.g. 2nd Floor)" value={field.value} onChange={e => updateDynamicField('specifications', field.id, field.key, e.target.value)} className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200" />
                      <button type="button" onClick={() => removeDynamicField('specifications', field.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addDynamicField('specifications')} className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">+ Add Custom Spec</button>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-md">3. Amenities</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Basic Amenities</label>
                    <textarea rows={2} value={formData.basicAmenities} onChange={e => handleInputChange('basicAmenities', e.target.value)} placeholder="WiFi, AC, Guard..." className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50" />
                  </div>
                  
                  {/* Dynamic Amenities */}
                  {formData.dynamicAmenities.map((field) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <input type="text" placeholder="Key (e.g. Security)" value={field.key} onChange={e => updateDynamicField('dynamicAmenities', field.id, e.target.value, field.value)} className="w-1/3 text-sm px-3 py-2 rounded-lg border border-slate-200" />
                      <input type="text" placeholder="Value (e.g. CCTV & Guard)" value={field.value} onChange={e => updateDynamicField('dynamicAmenities', field.id, field.key, e.target.value)} className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200" />
                      <button type="button" onClick={() => removeDynamicField('dynamicAmenities', field.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={16} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addDynamicField('dynamicAmenities')} className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1">+ Add Custom Amenity</button>
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-orange-500 transition-all duration-200 flex items-center justify-center gap-2">
                  Save & Proceed to Assets
                </button>
              </form>
            )}

            {/* STEP 2: ASSETS UPLOAD (MOCK) */}
            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl border border-orange-100 text-sm font-semibold">
                  Property Data Saved! Now upload media for <span className="font-bold">{formData.title}</span>.
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex gap-3 mb-3 text-slate-400">
                    <ImageIcon size={32} />
                    <Video size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Drag & drop files to Cloudflare R2</p>
                  <p className="text-xs text-slate-400 mt-1">Supports MP4, JPG, PNG up to 50MB</p>
                  <button className="mt-4 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-300 transition-colors">
                    Browse Files
                  </button>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setActiveStep(1)} className="flex-1 bg-slate-100 text-slate-700 font-bold text-sm py-3.5 rounded-xl hover:bg-slate-200 transition-all">
                    Back to Details
                  </button>
                  <button onClick={handleStep2Submit} className="flex-1 bg-slate-900 text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-orange-500 transition-all">
                    Complete Listing
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT CONTAINER: PROPERTIES FEED & FILTERS */}
          <section className="xl:col-span-7 space-y-4">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input type="text" placeholder="Search title or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900" />
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

              <select value={filterPropertyType} onChange={e => setFilterPropertyType(e.target.value)} className="text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                <option value="Single Room">Single Room</option>
                <option value="2 BHK">2 BHK</option>
                <option value="Full House">Full House</option>
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

            {/* Properties Display */}
            {filteredAndSortedProperties.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-3'}>
                {filteredAndSortedProperties.map((item) => (
                  <div key={item.id} className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex ${viewMode === 'grid' ? 'flex-col' : 'items-center justify-between gap-4'} ${item.isArchived ? 'opacity-60 grayscale' : ''}`}>
                    
                    <div className={`flex ${viewMode === 'grid' ? 'flex-col gap-3' : 'items-center gap-4'} min-w-0 flex-1`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.images[0] || 'https://via.placeholder.com/150'} alt={item.title} className={`${viewMode === 'grid' ? 'w-full h-32' : 'w-16 h-16'} rounded-lg object-cover bg-slate-100 flex-shrink-0`} />
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-800 truncate">{item.title}</h3>
                          <span className="bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">{item.id}</span>
                          {item.isArchived && <span className="bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest">Archived</span>}

                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-400 font-medium">
                          <span className="flex items-center gap-0.5 text-slate-600 font-semibold"><MapPin size={12} className="text-orange-500" /> {item.location}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{item.categories.join(', ')}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="mt-1 text-sm font-extrabold text-slate-900 flex items-center">
                          <DollarSign size={13} className="text-slate-400 -mr-0.5" />{item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 flex-shrink-0 ${viewMode === 'grid' ? 'mt-3 justify-end pt-3 border-t border-slate-100' : ''}`}>
                      <Link href={`/?view=${item.id}`} target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" title="View on Public Site">
                        <ExternalLink size={16} />
                      </Link>
                      <button onClick={() => handleToggleArchive(item.id)} className={`p-2 rounded-lg transition-colors ${item.isArchived ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`} title={item.isArchived ? 'Unarchive' : 'Archive'}>
                        <Archive size={16} />
                      </button>
                      <button onClick={() => handleEdit(item)} className="p-2 rounded-lg text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors" title="Edit Listing">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete Property">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-medium">
                No properties match your current filters.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}