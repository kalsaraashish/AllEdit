export default function Loader({ message = 'Processing…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-600 animate-spin" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  )
}
