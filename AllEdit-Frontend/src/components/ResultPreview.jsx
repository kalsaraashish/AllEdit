import { useEffect, useState } from 'react'
import { blobToUrl } from '../utils/format'

export default function ResultPreview({ blob, filename, onReset }) {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    if (!blob) return
    const u = blobToUrl(blob)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [blob])

  if (!blob || !url) return null

  const isImage = blob.type.startsWith('image/')
  const isPdf   = blob.type === 'application/pdf'

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Ready to download</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Start over
        </button>
      </div>

      {isImage && (
        <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 max-h-72 flex items-center justify-center">
          <img src={url} alt="Result preview" className="max-h-72 object-contain" />
        </div>
      )}

      <a
        href={url}
        download={filename}
        className="btn-primary w-full justify-center"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download {filename}
      </a>
    </div>
  )
}
