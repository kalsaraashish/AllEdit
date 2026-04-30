import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import MergePDF from './pages/pdf/MergePDF'
import CompressPDF from './pages/pdf/CompressPDF'
import ImageToPDF from './pages/pdf/ImageToPDF'
import DocumentsToPDF from './pages/pdf/DocumentsToPDF'
import WordToPDF from './pages/pdf/WordToPDF'
import PDFToWord from './pages/pdf/PDFToWord'
import PowerPointToPDF from './pages/pdf/PowerPointToPDF'
import PDFToImage from './pages/pdf/PDFToImage'
import CompressImage from './pages/image/CompressImage'
import ConvertImage from './pages/image/ConvertImage'
import ResizeImage from './pages/image/ResizeImage'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pdf/merge" element={<MergePDF />} />
              <Route path="/pdf/compress" element={<CompressPDF />} />
              <Route path="/pdf/image-to-pdf" element={<ImageToPDF />} />
              <Route path="/pdf/documents-to-pdf" element={<DocumentsToPDF />} />
              <Route path="/pdf/word-to-pdf" element={<WordToPDF />} />
              <Route path="/pdf/pdf-to-word" element={<PDFToWord />} />
              <Route path="/pdf/powerpoint-to-pdf" element={<PowerPointToPDF />} />
              <Route path="/pdf/pdf-to-image" element={<PDFToImage />} />
              <Route path="/image/compress" element={<CompressImage />} />
              <Route path="/image/convert" element={<ConvertImage />} />
              <Route path="/image/resize" element={<ResizeImage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
