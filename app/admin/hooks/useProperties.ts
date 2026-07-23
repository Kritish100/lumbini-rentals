import { useState, useEffect, useCallback } from 'react'
import type { AdminProperty } from '@/app/admin/types'
import * as propertiesApi from '../services/properties'

export function useProperties() {
  const [properties, setProperties] = useState<AdminProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await propertiesApi.getAdminProperties()
      setProperties(res?.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch on mount
  useEffect(() => {
    refetch()
  }, [refetch])

  const createProperty = useCallback(async (data: Partial<AdminProperty>): Promise<void> => {
    setError(null)
    try {
      await propertiesApi.createProperty(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    }
  }, [])


  const updateProperty = useCallback(async (id: string, data: Partial<AdminProperty>) => {
    setError(null)
    try {
      await propertiesApi.updateProperty(id, data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update property')
    }
  }, [])
  

  const uploadAssets = useCallback(async (id: string, data: Partial<AdminProperty>) => {
   
  }, [])

  const deleteProperties = useCallback(async (ids: string[]) => {
    setError(null)
    try {
      await propertiesApi.deleteProperties(ids)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete properties")
    }
  }, [])

  const toggleArchive = useCallback(async (id: string, value: boolean) => {
    setError(null)
    try {
      await propertiesApi.toggleArchive(id, value)
      // update the archive status locally to reflect on UI
      setProperties(prev => prev.map(prop => ({...prop, isArchived: id === prop.id ? value : prop.isArchived})))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    }
  }, [])

  const toggleNegotiable = useCallback(async (id: string, value: boolean) => {
    setError(null)
    try {
      await propertiesApi.toggleNegotiable(id, value)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    }
  }, [])

  return {
    properties,
    isPropertiesLoading: isLoading,
    error,
    refetchProperties: refetch,
    createProperty,
    updateProperty,
    uploadAssets,
    deleteProperties,
    toggleArchive,
    toggleNegotiable,
  }
}