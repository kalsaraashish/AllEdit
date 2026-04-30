import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const ACCEPT = {
  'application/pdf': ['.pdf'],
}

export default function PDFToWord() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.pdfToWord(files[0])
      return res.data
    })
  }

  const outputName = files[0]?.name.replace(/\.[^.]+$/, '') || 'document'

  return (
    <ToolLayout
      title="PDF to Word"
      subtitle="Convert a PDF into an editable DOCX document."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          label="Drop a PDF file here"
          hint="PDF only · Single file"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting PDF to Word…" />
      ) : result ? (
        <ResultPreview blob={result} filename={`${outputName}.docx`} onReset={reset} />
      ) : (
        <button
          onClick={handleProcess}
          disabled={files.length === 0}
          className="btn-primary w-full justify-center"
        >
          Convert to Word
        </button>
      )}
    </ToolLayout>
  )
}
