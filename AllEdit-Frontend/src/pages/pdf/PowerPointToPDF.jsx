import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const ACCEPT = {
  'application/vnd.ms-powerpoint': ['.ppt'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
}

export default function PowerPointToPDF() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.powerpointToPdf(files[0])
      return res.data
    })
  }

  const outputName = files[0]?.name.replace(/\.[^.]+$/, '') || 'presentation'

  return (
    <ToolLayout
      title="PowerPoint to PDF"
      subtitle="Convert PPT or PPTX presentations into PDF documents."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          label="Drop a PowerPoint file here"
          hint="PPT, PPTX · Single file"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting PowerPoint to PDF…" />
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
