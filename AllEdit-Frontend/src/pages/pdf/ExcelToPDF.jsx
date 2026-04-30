import ToolLayout from '../../components/ToolLayout'
import FileUpload from '../../components/FileUpload'
import Loader from '../../components/Loader'
import ResultPreview from '../../components/ResultPreview'
import ErrorMessage from '../../components/ErrorMessage'
import { useToolState } from '../../hooks/useToolState'
import { pdfApi } from '../../services/api'

const ACCEPT = {
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
}

export default function ExcelToPDF() {
  const { files, setFiles, loading, result, error, removeFile, reset, run } = useToolState()

  const handleProcess = () => {
    run(async () => {
      const res = await pdfApi.excelToPdf(files[0])
      return res.data
    })
  }

  const outputName = files[0]?.name.replace(/\.[^.]+$/, '') || 'document'

  return (
    <ToolLayout
      title="Excel to PDF"
      subtitle="Convert an XLS or XLSX file into a PDF document."
    >
      <div className="card p-5">
        <FileUpload
          files={files}
          setFiles={setFiles}
          onRemove={removeFile}
          accept={ACCEPT}
          label="Drop an Excel file here"
          hint="XLS, XLSX · Single file"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <Loader message="Converting Excel to PDF…" />
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
