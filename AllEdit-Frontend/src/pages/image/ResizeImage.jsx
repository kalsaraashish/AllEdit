import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { imageApi } from '../../services/api'

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'image/webp': ['.webp'],
}

export default function ResizeImage() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()
  const [width, setWidth]   = useState('')
  const [height, setHeight] = useState('')
  const [unit, setUnit]     = useState('px')
  const [lock, setLock]     = useState(true)

  const handleProcess = () => {
    run(async () => {
      const res = await imageApi.resize(files[0], width || null, height || null, lock)
      return res.data
    })
  }

  const ext = files[0] ? files[0].name.split('.').pop() : 'img'
  const canProcess = files.length > 0 && (width || height)

  return (
    <ToolLayout
      title="Resize Image"
      subtitle="Scale your image to specific dimensions in pixels or percentages."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          label="Drop an image here"
          hint="JPG, PNG, WEBP · Single file"
        />
      </div>

      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <label className="label mb-0">Dimensions</label>
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {['px', '%'].map(u => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-150 ${
                  unit === u
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div>
            <label className="label">Width</label>
            <input
              type="number"
              value={width}
              onChange={e => setWidth(e.target.value)}
              placeholder={unit === '%' ? '100' : '1920'}
              className="input-base"
              min={1}
            />
          </div>

          <button
            onClick={() => setLock(l => !l)}
            className={`mt-5 w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${lock ? 'border-accent-400 bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500'}`}
            title={lock ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
          >
            {lock ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <rect x="5" y="11" width="14" height="10" rx="2"/>
                <path d="M8 11V7a4 4 0 018 0v4"/>
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <rect x="5" y="11" width="14" height="10" rx="2"/>
                <path d="M8 11V7a4 4 0 017.9-1"/>
              </svg>
            )}
          </button>

          <div>
            <label className="label">Height</label>
            <input
              type="number"
              value={height}
              onChange={e => setHeight(e.target.value)}
              placeholder={unit === '%' ? '100' : '1080'}
              className="input-base"
              min={1}
            />
          </div>
        </div>

        {lock && (
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Aspect ratio will be preserved. Leave one field empty to auto-calculate.
          </p>
        )}
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Resizing image…" />
      ) : result ? (
        <ResultPreview blob={result} filename={`resized.${ext}`} onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={!canProcess}
          className="btn-primary w-full justify-center"
        >
          Resize Image
        </button>
      )}
    </ToolLayout>
  )
}
