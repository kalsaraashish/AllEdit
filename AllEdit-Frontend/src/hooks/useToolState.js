import { useState } from 'react'

async function getErrorMessage(error) {
  const payload = error?.response?.data

  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object' && !(payload instanceof Blob)) {
    return payload.message || payload.title || null
  }

  if (payload instanceof Blob) {
    try {
      const text = (await payload.text())?.trim()
      if (!text) return null

      try {
        const parsed = JSON.parse(text)
        return parsed.message || parsed.title || text
      } catch {
        return text
      }
    } catch {
      return null
    }
  }

  return null
}

export function useToolState() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const reset = () => {
    setFiles([])
    setResult(null)
    setError(null)
  }

  const run = async (apiFn) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await apiFn()
      setResult(res)
    } catch (e) {
      const apiMessage = await getErrorMessage(e)
      setError(apiMessage || e.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return { files, setFiles, loading, result, error, removeFile, reset, run }
}
