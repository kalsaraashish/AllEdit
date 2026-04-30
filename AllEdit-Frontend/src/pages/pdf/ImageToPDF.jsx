import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png':  ['.png'],
  'image/webp': ['.webp'],
  'image/gif':  ['.gif'],
}

export default function ImageToPDF() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.imageToPdf(files)
      return res.data
    })
  }

  return (
    <ToolLayout
      title="Image to PDF"
      subtitle="Convert one or more images into a single PDF document."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          multiple
          label="Drop images here"
          hint="JPG, PNG, WEBP, GIF · Multiple allowed"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting to PDF…" />
      ) : result ? (
        <ResultPreview blob={result} filename="images.pdf" onReset={reset} />
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
