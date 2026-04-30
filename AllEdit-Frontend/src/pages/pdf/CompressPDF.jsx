import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const QUALITY_OPTIONS = [
  { label: 'Low',    value: 'low',    hint: 'Smallest file, lower quality' },
  { label: 'Medium', value: 'medium', hint: 'Good balance (recommended)' },
  { label: 'High',   value: 'high',   hint: 'Near-original quality' },
]

export default function CompressPDF() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()
  const [quality, setQuality] = useState('medium')

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.compress(files[0], quality)
      return res.data
    })
  }

  return (
    <ToolLayout
      title="Compress PDF"
      subtitle="Reduce your PDF file size while keeping it readable and sharp."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={{ 'application/pdf': ['.pdf'] }}
          label="Drop a PDF file here"
          hint="Single file · PDF only"
        />
      </div>

      <div className="card p-5">
        <label className="label">Compression Quality</label>
        <div className="grid grid-cols-3 gap-2">
          {QUALITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setQuality(opt.value)}
              className={`px-3 py-3 rounded-lg border text-left transition-all duration-150 ${
                quality === opt.value
                  ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className={`block text-sm font-medium ${quality === opt.value ? 'text-accent-700 dark:text-accent-300' : 'text-gray-800 dark:text-gray-200'}`}>
                {opt.label}
              </span>
              <span className="block text-xs text-gray-400 dark:text-gray-500 mt-0.5">{opt.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Compressing PDF…" />
      ) : result ? (
        <ResultPreview blob={result} filename="compressed.pdf" onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className="btn-primary w-full justify-center"
        >
          Compress PDF
        </button>
      )}
    </ToolLayout>
  )
}
