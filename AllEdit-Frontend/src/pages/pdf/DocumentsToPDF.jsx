import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
}

export default function DocumentsToPDF() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.documentsToPdf(files)
      return res.data
    })
  }

  return (
    <ToolLayout
      title="Documents to PDF"
      subtitle="Drop mixed Word, Excel, PowerPoint, PDF, or image files and combine everything into one final PDF."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          multiple
          label="Drop documents here"
          hint="PDF, Word, Excel, PowerPoint, images · Multiple allowed"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting documents to PDF…" />
      ) : result ? (
        <ResultPreview blob={result} filename="documents.pdf" onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className="btn-primary w-full justify-center"
        >
          Convert all to PDF
        </button>
      )}
    </ToolLayout>
  )
}
