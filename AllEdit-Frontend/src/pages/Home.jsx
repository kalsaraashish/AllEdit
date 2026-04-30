import ToolCard from '../components/ToolCard'

const PDF_TOOLS = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document in seconds.',
    path: '/pdf/merge',
    color: 'blue',
    icon: MergeIcon,
  },
  {
    title: 'Compress PDF',
    description: 'Reduce PDF file size while preserving visual quality.',
    path: '/pdf/compress',
    color: 'teal',
    icon: CompressIcon,
  },
  {
    title: 'Image to PDF',
    description: 'Convert JPG, PNG or other images into a PDF document.',
    path: '/pdf/image-to-pdf',
    color: 'amber',
    icon: ImageToPdfIcon,
  },
  {
    title: 'PDF to Image',
    description: 'Export every page of a PDF as a high-quality image.',
    path: '/pdf/pdf-to-image',
    color: 'rose',
    icon: PdfToImageIcon,
  },
]

const IMAGE_TOOLS = [
  {
    title: 'Compress Image',
    description: 'Shrink image file sizes without sacrificing quality.',
    path: '/image/compress',
    color: 'teal',
    icon: ShrinkIcon,
  },
  {
    title: 'Convert Format',
    description: 'Convert images between JPG, PNG, WEBP and more.',
    path: '/image/convert',
    color: 'blue',
    icon: ConvertIcon,
  },
  {
    title: 'Resize Image',
    description: 'Scale images to exact pixel dimensions or percentages.',
    path: '/image/resize',
    color: 'amber',
    icon: ResizeIcon,
  },
]

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-50 dark:bg-accent-900/30 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
          <span className="text-xs font-medium text-accent-700 dark:text-accent-300">Free & browser-based</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight leading-tight">
          All-in-One PDF &<br />Image Toolkit
        </h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 text-base leading-relaxed">
          A complete set of tools for working with PDF and image files. No uploads to third-party servers.
        </p>
      </div>

      <Section label="PDF Tools">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PDF_TOOLS.map(t => <ToolCard key={t.path} {...t} />)}
        </div>
      </Section>

      <Section label="Image Tools" className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {IMAGE_TOOLS.map(t => <ToolCard key={t.path} {...t} />)}
        </div>
      </Section>
    </div>
  )
}

function Section({ label, children, className = '' }) {
  return (
    <section className={className}>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">{label}</h2>
      {children}
    </section>
  )
}

/* ─── Inline SVG Icons ─────────────────────────────── */

function MergeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6H4a2 2 0 00-2 2v8a2 2 0 002 2h4"/>
      <path d="M16 6h4a2 2 0 012 2v8a2 2 0 01-2 2h-4"/>
      <line x1="12" y1="3" x2="12" y2="21"/>
      <polyline points="9 6 12 3 15 6"/>
      <polyline points="9 18 12 21 15 18"/>
    </svg>
  )
}

function CompressIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20"/>
      <polyline points="20 10 14 10 14 4"/>
      <line x1="10" y1="14" x2="3" y2="21"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
    </svg>
  )
}

function ImageToPdfIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}

function PdfToImageIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  )
}

function ShrinkIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      <line x1="8" y1="11" x2="14" y2="11"/>
    </svg>
  )
}

function ConvertIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 014-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 01-4 4H3"/>
    </svg>
  )
}

function ResizeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/>
      <polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
      <line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  )
}
