export default function ToolLayout({ title, subtitle, children }) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="space-y-5">
        {children}
      </div>
    </div>
  )
}
