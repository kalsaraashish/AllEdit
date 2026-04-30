import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import { formatBytes } from '../utils/format'

export default function FileUpload({
  files,
  setFiles,
  onRemove,
  accept,
  multiple = false,
  label = 'Drop files here',
  hint,
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      setFiles(multiple ? prev => [...prev, ...accepted] : [accepted[0]])
    },
    accept,
    multiple,
  })

  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    // Firefox requires some data to be set
    e.dataTransfer.setData('text/plain', index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, index) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    setFiles(prev => {
      const copy = [...prev]
      const [draggedFile] = copy.splice(draggedIndex, 1)
      copy.splice(index, 0, draggedFile)
      return copy
    })
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150
          ${isDragActive
            ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-accent-400 dark:hover:border-accent-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isDragActive ? 'bg-accent-100 dark:bg-accent-800/40' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <svg className={`w-6 h-6 transition-colors ${isDragActive ? 'text-accent-600 dark:text-accent-400' : 'text-gray-400 dark:text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {isDragActive ? 'Release to upload' : label}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {hint || 'or click to browse'}
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              draggable={multiple}
              onDragStart={(e) => multiple && handleDragStart(e, i)}
              onDragOver={multiple ? handleDragOver : undefined}
              onDrop={(e) => multiple && handleDrop(e, i)}
              onDragEnd={() => setDraggedIndex(null)}
              className={`flex items-center justify-between px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg ${multiple ? 'cursor-grab active:cursor-grabbing' : ''} ${draggedIndex === i ? 'opacity-50' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {multiple && (
                  <div className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0 cursor-grab px-1 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                    </svg>
                  </div>
                )}
                <div className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRemove(i)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
