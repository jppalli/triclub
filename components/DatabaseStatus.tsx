'use client'

import { useState, useEffect } from 'react'
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react'

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        setStatus('connected')
      } else {
        setStatus('error')
        setError('Database connection failed')
      }
    } catch (err) {
      setStatus('error')
      setError('Unable to connect to database')
    }
  }

  if (status === 'checking') {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <Loader className="h-4 w-4 animate-spin" />
        <span className="text-sm">Verificando conexión...</span>
      </div>
    )
  }

  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm">Base de datos conectada</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-red-400">
      <XCircle className="h-4 w-4" />
      <span className="text-sm">Error: {error}</span>
    </div>
  )
}