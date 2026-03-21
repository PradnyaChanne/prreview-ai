import SeverityBadge from './SeverityBadge'

function IssueCard({ issue }) {
  const categoryIcons = {
    bug: '🐛',
    security: '🔒',
    performance: '⚡',
    style: '✨',
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>{categoryIcons[issue.category] || '📌'}</span>
          <span className="text-gray-300 text-sm font-medium capitalize">{issue.category}</span>
          {issue.line > 0 && (
            <span className="text-gray-500 text-xs">Line {issue.line}</span>
          )}
        </div>
        <SeverityBadge severity={issue.severity} />
      </div>
      <p className="text-gray-300 text-sm">{issue.description}</p>
      <div className="bg-gray-900 rounded p-3">
        <p className="text-xs text-gray-500 mb-1">💡 Suggestion</p>
        <p className="text-green-400 text-sm">{issue.suggestion}</p>
      </div>
    </div>
  )
}

export default IssueCard