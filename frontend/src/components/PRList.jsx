function PRList({ prs, onSelect, loading }) {
  if (loading) return (
    <div className="text-center py-4 text-gray-500">
      <span className="animate-spin inline-block mr-2">⏳</span>
      Loading PRs...
    </div>
  )

  if (prs.length === 0) return (
    <div className="text-center py-4 text-gray-500">
      No open pull requests found
    </div>
  )

  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-sm">Select a pull request to review:</p>
      {prs.map((pr) => (
        <button
          key={pr.number}
          onClick={() => onSelect(pr)}
          className="w-full text-left px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-xs font-mono">#{pr.number}</span>
            <span className="text-gray-300 text-sm">{pr.title}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

export default PRList