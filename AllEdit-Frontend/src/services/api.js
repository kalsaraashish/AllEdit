import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5111/api',
  timeout: 60000,
})

function form(files, extra = {}, fieldNames = {}) {
  const {
    single = 'file',
    multi = 'files',
    first = 'firstFile',
    second = 'secondFile',
  } = fieldNames

  const fd = new FormData()
  if (Array.isArray(files)) {
    files.forEach(f => fd.append(multi, f))
  } else if (files) {
    // Check if this is a file pair (for compare endpoints)
    if (extra && extra.file2) {
      fd.append(first, files)
      fd.append(second, extra.file2)
      // Remove file2 from extra so it doesn't get added again
      const { file2, ...otherExtra } = extra
      Object.entries(otherExtra).forEach(([k, v]) => fd.append(k, v))
    } else {
      fd.append(single, files)
      Object.entries(extra).forEach(([k, v]) => {
        if (v === null || v === undefined) return
        fd.append(k, v)
      })
    }
  }
  return fd
}

const opts = { responseType: 'blob' }

export const pdfApi = {
  merge:        (files)        => api.post('/pdf/merge', form(files, {}, { multi: 'files' }), opts),
  compress:     (file)         => api.post('/pdf/compress', form(file, {}, { single: 'file' }), opts),
  imageToPdf:   (files)        => api.post('/pdf/image-to-pdf', form(files, {}, { multi: 'files' }), opts),
  documentsToPdf: (files)      => api.post('/pdf/documents-to-pdf', form(files, {}, { multi: 'files' }), opts),
  wordToPdf:    (file)         => api.post('/pdf/word-to-pdf', form(file, {}, { single: 'file' }), opts),
  pdfToWord:    (file)         => api.post('/pdf/pdf-to-word', form(file, {}, { single: 'file' }), opts),
  powerpointToPdf: (file)      => api.post('/pdf/powerpoint-to-pdf', form(file, {}, { single: 'file' }), opts),
  pdfToImage:   (file, format)  => api.post('/pdf/pdf-to-image', form(file, { format }, { single: 'file' }), opts),
  compare:      (file1, file2)  => api.post('/pdf/compare', form(file1, { file2 }, { first: 'firstFile', second: 'secondFile' }), {}),
}

export const imageApi = {
  compress: (file, quality) => api.post('/image/compress', form(file, { quality }, { single: 'file' }), opts),
  convert:  (file, format) => api.post('/image/convert', form(file, { format }, { single: 'file' }), opts),
  resize:   (file, width, height, keepAspectRatio) => api.post('/image/resize', form(file, { width, height, keepAspectRatio }, { single: 'file' }), opts),
  compare:  (file1, file2) => api.post('/image/compare', form(file1, { file2 }, { first: 'firstFile', second: 'secondFile' }), {}),
}
