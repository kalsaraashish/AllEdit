import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const FORMATS = ['jpg', 'png', 'webp']

export default function PDFToImage() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()
  const [format, setFormat] = useState('jpg')

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.pdfToImage(files[0], format)
      return res.data
    })
  }

  return (
    <ToolLayout
      title="PDF to Image"
      subtitle="Convert each page of a PDF into a separate image file."
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
        <label className="label">Output Format</label>
        <div className="flex gap-2">
          {FORMATS.map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium font-mono uppercase tracking-wide transition-all duration-150 ${
                format === f
                  ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting pages…" />
      ) : result ? (
        <ResultPreview blob={result} filename={`pdf-pages.zip`} onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className="btn-primary w-full justify-center"
        >
          Convert to Images
        </button>
      )}
    </ToolLayout>
  )
}
