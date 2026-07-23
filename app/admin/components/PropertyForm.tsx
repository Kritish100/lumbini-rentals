'use client'
import { useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Plus, RotateCcw, X } from 'lucide-react'
import type { AdminProperty, DynamicField } from '@/app/admin/types'

const SPEC_KEY_PRESETS = [
  'Floor', 'Facing', 'Furnishing', 'Parking', 'Bathroom Type'
]

// Shape of the form's internal values — price/longitude/latitude are strings
// in the form (since inputs are strings) and get converted on submit.
type PropertyFormValues =   Omit<AdminProperty, "specifications"> & {
    specifications: DynamicField[]
}

const DEFAULT_FORM_VALUES = {
  title: '', type: "1 BHK", mapsUrl: '', location: '', subLocation: '', longitude: '', latitude: '', 
  category: [] as string[], status: 'Available' as string, description: '', price: 0,
  isArchived: false, isActiveOffer: false, offerDescription: '',
  specifications: [] as DynamicField[], 
  isNegotiable: false
}

interface PropertyFormProps {
  editingId: string | null;
  properties: AdminProperty[];
  createProperty: (data: Partial<AdminProperty>) => void;
  updateProperty: (id:string, data: Partial<AdminProperty>) => void;
  refetchProperties: () => void;
  onCancel: () => void;
}


export default function PropertyForm({ 
    editingId, properties, createProperty, updateProperty, refetchProperties, onCancel 
}: PropertyFormProps) {

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting }
  } = useForm<PropertyFormValues>({
    defaultValues: DEFAULT_FORM_VALUES
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications'
  })

  // When the `property` prop changes (user clicks Edit on a different row,
  // or clicks Cancel and it goes back to null), reset the form to match.
  useEffect(() => {
    if (editingId) {
      const property = properties.find(prop => prop.id === editingId);
      reset({
        ...DEFAULT_FORM_VALUES,
        ...(property || {}),
        price: property?.price,
        longitude: property?.longitude?.toString() ?? '',
        latitude: property?.latitude?.toString() ?? '',
        specifications: Object.entries(property?.specifications || {}).map(([key, value], i) => ({id: i.toString(), key, value, keyType: "custom"}))
      })
    } else {
      reset(DEFAULT_FORM_VALUES)
    }
  }, [editingId, reset])

  const isActiveOffer = watch('isActiveOffer')
  const category = watch('category')

  const onSubmit = async (data: PropertyFormValues) => {
    const payload: Partial<AdminProperty> = {
      ...data,
      price: Number(data.price),
      specifications: Object.assign({}, ...data.specifications.map(i => ({ [i.key]: i.value }))) // [{key: "furnishing", value: "semi"}] => {"furnishing": "semi"}
    }

    console.log(payload)

    try {
        if(editingId) {
          await updateProperty(editingId, payload)
        } else {
          await createProperty(payload)
        }
    } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to save property. Please try again.')
    } finally {
      refetchProperties()
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Plus size={18} className="text-orange-500" />
          <h2 className="text-base font-bold uppercase tracking-wide text-slate-800">
            {editingId ? 'Edit Listing Details' : 'Add New Listing'}
          </h2>
        </div>

        <div className='flex items-center'>
          <button type="button" onClick={() => reset(DEFAULT_FORM_VALUES)} className="flex items-center text-xs font-bold text-slate-400 hover:text-slate-700 uppercase">
            <RotateCcw size={14} className='mr-1' /> Reset
          </button>
          {editingId && (
            <button type="button" onClick={onCancel} className="text-xs ml-3 font-bold text-slate-400 hover:text-slate-700 uppercase">
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-md">1. Basic Info</h3>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register('title', { required: true })}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Category <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  value="Residential"
                  {...register('category', { required: true })}
                  className="w-4 h-4 accent-slate-900"
                />
                Residential
              </label>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <input
                  type="checkbox"
                  value="Commercial"
                  {...register('category', { required: true })}
                  className="w-4 h-4 accent-slate-900"
                />
                Commercial
              </label>
            </div>
          </div>

          <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Property Type <span className="text-red-500">*</span></label>
              <select {...register('type')} className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                <option value="1 BHK">1 BHK</option>
                <option value="Full House">Full House</option>
                <option value="Single Room">Single Room</option>
              </select>
        </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Status</label>
              <select {...register('status')} className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                <option value="Available">Available</option>
                <option value="On Hold">On Hold</option>
                <option value="Booked">Booked</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Price (NPR) <span className="text-red-500">*</span></label>
              <input
                type="number"
                {...register('price', { required: true })}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>


          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Owner Details <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Owner Name"
                {...register('ownerName')}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
              />
              <input
                type="text"
                placeholder="Owner Contact"
                {...register('ownerContact')}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Location Data</label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Location"
                {...register('location')}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
              />
              <input
                type="text"
                placeholder="Sub Location"
                {...register('subLocation')}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
              />
            </div>
            <input
              type="url"
              placeholder="Google Maps URL"
              {...register('mapsUrl')}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
            />
          </div>


          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-slate-900 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" {...register('isNegotiable')} className="w-4 h-4 accent-slate-900" /> Negotiable
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" {...register('isArchived')} className="w-4 h-4 accent-slate-900" /> Archived
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" {...register('isActiveOffer')} className="w-4 h-4 accent-orange-500" /> Active Offer
          </label>
        </div>

        {isActiveOffer && (
          <div>
            <label className="block text-xs font-bold text-orange-600 mb-1">Offer Description</label>
            <input
              type="text"
              {...register('offerDescription')}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:border-orange-500 bg-orange-50/50"
            />
          </div>
        )}

        {/* Specifications */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded-md">Specifications</h3>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-center">
              {field.keyType === 'preset' ? (
                <select
                  {...register(`specifications.${index}.key` as const)}
                  className="w-1/3 text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="" disabled>Select key...</option>
                  {SPEC_KEY_PRESETS.map(preset => (
                    <option key={preset} value={preset}>{preset}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Key (e.g. Floor)"
                  {...register(`specifications.${index}.key` as const)}
                  className="w-1/3 text-sm px-3 py-2 rounded-lg border border-slate-200"
                />
              )}

              <input
                type="text"
                placeholder="Value (e.g. 2nd Floor)"
                {...register(`specifications.${index}.value` as const)}
                className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200"
              />

              <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <X size={16} />
              </button>
            </div>
          ))}

          <div className="flex gap-4 my-5">
            <button
              type="button"
              onClick={() => append({ id: Date.now().toString(), key: '', value: '', keyType: 'preset' })}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              + Add Preset Spec
            </button>
            <button
              type="button"
              onClick={() => append({ id: Date.now().toString(), key: '', value: '', keyType: 'custom' })}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              + Add Custom Spec
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-4 bg-slate-900 text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-orange-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Property Details'}
        </button>
      </form>
    </div>
  )
}