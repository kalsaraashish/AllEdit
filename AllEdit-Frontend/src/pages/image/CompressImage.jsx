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

export default function CompressImage() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()
  const [quality, setQuality] = useState(80)

  const handleProcess = () => {
    run(async () => {
      const res = await imageApi.compress(files[0], quality)
      return res.data
    })
  }

  const qualityLabel = quality >= 80 ? 'High' : quality >= 50 ? 'Medium' : 'Low'
  const qualityColor  = quality >= 80 ? 'text-green-600 dark:text-green-400' : quality >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'

  const ext = files[0] ? files[0].name.split('.').pop() : 'img'

  return (
    <ToolLayout
      title="Compress Image"
      subtitle="Reduce image file size by adjusting quality. Works with JPG, PNG, and WEBP."
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

      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="label mb-0">Quality</label>
          <span className={`text-sm font-semibold ${qualityColor}`}>
            {qualityLabel} ({quality}%)
          </span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          step={5}
          value={quality}
          onChange={e => setQuality(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-accent-600"
        />
        <div className="flex justify-between mt-1.5 text-xs text-gray-400 dark:text-gray-500">
          <span>Smallest</span>
          <span>Best quality</span>
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Compressing image…" />
      ) : result ? (
        <ResultPreview blob={result} filename={`compressed.${ext}`} onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className="btn-primary w-full justify-center"
        >
          Compress Image
        </button>
      )}
    </ToolLayout>
  )
}
