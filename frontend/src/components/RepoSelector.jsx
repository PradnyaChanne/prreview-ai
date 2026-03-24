function RepoSelector({ repos, selectedRepo, onSelect }) {
  return (
    <div className="space-y-2">
      <p className="text-gray-400 text-sm">Select a repository:</p>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {repos.map((repo) => (
          <button
            key={repo.fullName}
            onClick={() => onSelect(repo)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
              selectedRepo?.fullName === repo.fullName
                ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{repo.private ? '🔒' : '📂'}</span>
              <span className="font-medium text-sm">{repo.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default RepoSelector