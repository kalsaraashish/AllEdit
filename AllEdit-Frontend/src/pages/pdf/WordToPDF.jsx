import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const ACCEPT = {
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

export default function WordToPDF() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.wordToPdf(files[0])
      return res.data
    })
  }

  const outputName = files[0]?.name.replace(/\.[^.]+$/, '') || 'document'

  return (
    <ToolLayout
      title="Word to PDF"
      subtitle="Convert a DOC or DOCX file into a PDF document."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          label="Drop a Word file here"
          hint="DOC, DOCX · Single file"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting Word to PDF…" />
      ) : result ? (
        <ResultPreview blob={result} filename={`${outputName}.pdf`} onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className="btn-primary w-full justify-center"
        >
          Convert to PDF
        </button>
      )}
    </ToolLayout>
  )
}
