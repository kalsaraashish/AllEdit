import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

export default function MergePDF() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.merge(files)
      return res.data
    })
  }

  return (
    <ToolLayout
      title="Merge PDF"
      subtitle="Combine multiple PDF files into a single document. Drag to reorder before merging."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={{ 'application/pdf': ['.pdf'] }}
          multiple
          label="Drop PDF files here"
          hint="Supports multiple files · PDF only"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Merging PDFs…" />
      ) : result ? (
        <ResultPreview blob={result} filename="merged.pdf" onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length < 2}
          className="btn-primary w-full justify-center"
        >
          Merge {files.length > 0 ? `${files.length} Files` : 'PDFs'}
        </button>
      )}

      {files.length < 2 && !loading && !result && (
        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Add at least 2 PDF files to continue
        </p>
      )}
    </ToolLayout>
  )
}
