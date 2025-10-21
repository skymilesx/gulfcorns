'use client'

import { useEffect } from 'react'
import { useGulfAcornsStore } from '../src/lib/store'
import Index from '../src/pages/Index'

export default function HomePage() {
  const { refreshFromAPI } = useGulfAcornsStore()

  useEffect(() => {
    // Try to load data from API, but don't fail if it's not available
    refreshFromAPI().catch(() => {
      console.log('API not available, using client-side state')
    })
  }, [refreshFromAPI])

  return <Index />
}