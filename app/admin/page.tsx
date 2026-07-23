'use client'

import { useState } from 'react'
import { Building2, ExternalLink, RotateCcw, CheckCircle2 } from 'lucide-react'
import type { AdminProperty, DynamicField } from './types'

// Import the modular components
import PropertyForm from './components/PropertyForm'
import AssetUploader from './components/AssetUploader'
import PropertyList from './components/PropertyList'
import { clearAuthorizationCookie } from './actions'
import { useProperties } from './hooks/useProperties'


export default function AdminDashboard() {

  const {
    properties,
    isPropertiesLoading,
    createProperty,
    updateProperty,
    uploadAssets,
    deleteProperties,
    refetchProperties,
    toggleNegotiable,
    toggleArchive
  } = useProperties()

  // --- View States ---
  const [editingId, setEditingId] = useState<string | null>(null)
  const [openAssetsUpload, setOpenAssetsUpload] = useState<boolean>(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  const handleLogOut = async () => {
    try {
      await clearAuthorizationCookie();
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Failed to log out smoothly:', error);
    }
  }

  const showBanner = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(''), 4000)
  }


  const handleEdit = (property: AdminProperty) => {
    setEditingId(property.id)
    setOpenAssetsUpload(false) // close asset uploader if open
    setIsSidebarOpen(true) 
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleManageAssets = (id: string) => {
    setEditingId(null) // Close form editor if it's open
    setOpenAssetsUpload(true) // open asset uploader
    setIsSidebarOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResetPage = () => {

  }

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this property?')) {
      showBanner('Property deleted.')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setOpenAssetsUpload(false)
  }

  const handleCloseUploader = () => {
    setOpenAssetsUpload(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl text-white"><Building2 size={20} /></div>
            <div>
              <h1 className="text-md font-bold tracking-tight">Lumbini Rentals Admin</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Central Console</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="flex items-center gap-1.5 text-xs font-bold uppercase bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 transition-all text-slate-200">
              <ExternalLink size={14} /> Public Site
            </a>
            <button onClick={handleLogOut} className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 hover:text-slate-900 active:scale-[0.98]">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8 transition-all duration-300">
        {statusMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
            <CheckCircle2 size={16} className="text-emerald-600" /><span>{statusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* DYNAMIC LEFT SIDEBAR */}
          {isSidebarOpen && (
            <section className="xl:col-span-5 max-h-[85vh] overflow-y-auto scrollbar-thin rounded-2xl pr-2">
              {openAssetsUpload && editingId ? (
                <AssetUploader 
                  propertyId={editingId} 
                  propertyTitle={"find the title on ur own component"}
                  onClose={() => setOpenAssetsUpload(false)} 
                />
              ) : (
                <PropertyForm 
                  editingId={editingId} 
                  properties={properties}
                  createProperty={createProperty}
                  updateProperty={updateProperty}
                  refetchProperties={refetchProperties}
                  onCancel={handleCancelEdit} 
                />
              )}
            </section>
          )}

          {/* DYNAMIC RIGHT CONTAINER */}
          <section className={`${isSidebarOpen ? 'xl:col-span-7' : 'xl:col-span-12'} transition-all duration-300`}>
            <PropertyList 
              properties={properties}
              isPropertiesLoading={isPropertiesLoading}
              refetchProperties={refetchProperties}
              deleteProperties={deleteProperties}
              toggleNegotiable={toggleNegotiable}
              toggleArchive={toggleArchive}

              editingId={editingId}
              setEditingId={setEditingId}
              openAssets={() => setOpenAssetsUpload(true)}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          </section>
          
        </div>
      </main>
    </div>
  )
}