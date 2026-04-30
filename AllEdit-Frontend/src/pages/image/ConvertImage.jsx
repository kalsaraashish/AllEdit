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
  'image/gif':  ['.gif'],
  'image/bmp':  ['.bmp'],
}

const FORMATS = [
  { value: 'jpg',  label: 'JPG',  hint: 'Best for photos' },
  { value: 'png',  label: 'PNG',  hint: 'Supports transparency' },
  { value: 'webp', label: 'WEBP', hint: 'Modern & compact' },
]

export default function ConvertImage() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()
  const [format, setFormat] = useState('png')

  const handleProcess = () => {
    run(async () => {
      const res = await imageApi.convert(files[0], format)
      return res.data
    })
  }

  const originalName = files[0] ? files[0].name.replace(/\.[^.]+$/, '') : 'image'

  return (
    <ToolLayout
      title="Convert Image Format"
      subtitle="Transform images between popular formats without losing quality."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          label="Drop an image here"
          hint="JPG, PNG, WEBP, GIF, BMP · Single file"
        />
      </div>

      <div className="card p-5">
        <label className="label">Convert To</label>
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map(f => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              className={`py-3 px-3 rounded-lg border text-left transition-all duration-150 ${
                format === f.value
                  ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className={`block text-sm font-semibold font-mono ${format === f.value ? 'text-accent-700 dark:text-accent-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {f.label}
              </span>
              <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">{f.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting format…" />
      ) : result ? (
        <ResultPreview blob={result} filename={`${originalName}.${format}`} onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className="btn-primary w-full justify-center"
        >
          Convert to {format.toUpperCase()}
        </button>
      )}
    </ToolLayout>
  )
}
