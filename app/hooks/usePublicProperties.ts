import { useState, useEffect, useCallback } from 'react'
import * as propertiesApi from '../services/properties'
import { PublicProperty } from '../types'

export function usePublicProperties() {
  const [properties, setProperties] = useState<PublicProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await propertiesApi.getPublicProperties()
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


  return {
    properties,
    isPropertiesLoading: isLoading,
    error,
    refetchProperties: refetch,
  }
}