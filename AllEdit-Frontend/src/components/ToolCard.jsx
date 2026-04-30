import { useNavigate } from 'react-router-dom'

export default function ToolCard({ icon: Icon, title, description, path, color = 'blue' }) {
  const navigate = useNavigate()

  const colorMap = {
    blue:  'bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400',
    teal:  'bg-teal-50  dark:bg-teal-900/20  text-teal-600  dark:text-teal-400',
    rose:  'bg-rose-50  dark:bg-rose-900/20  text-rose-600  dark:text-rose-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
  }

  return (
    <button
      onClick={() => navigate(path)}
      className="card p-5 text-left w-full group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorMap[color] || colorMap.blue}`}>
        <Icon size={20} />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </button>
  )
}
