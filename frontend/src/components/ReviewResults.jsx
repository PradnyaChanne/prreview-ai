import ScoreCard from './ScoreCard'
import IssueCard from './IssueCard'

const CATEGORIES = ['all', 'bug', 'security', 'performance', 'style']

function ReviewResults({ result, activeCategory, setActiveCategory }) {
  const filteredIssues = activeCategory === 'all'
    ? result.issues
    : result.issues.filter(i => i.category === activeCategory)

  const countByCategory = (cat) =>
    result.issues.filter(i => i.category === cat).length

  return (
    <div className="space-y-6">
      <ScoreCard score={result.score} summary={result.summary} />

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
            {cat !== 'all' && countByCategory(cat) > 0 && (
              <span className="ml-2 bg-gray-700 text-gray-300 rounded-full px-2 py-0.5 text-xs">
                {countByCategory(cat)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No issues found in this category 🎉
          </div>
        ) : (
          filteredIssues.map((issue, index) => (
            <IssueCard key={index} issue={issue} />
          ))
        )}
      </div>
    </div>
  )
}

export default ReviewResults