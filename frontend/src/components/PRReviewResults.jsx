import IssueCard from './IssueCard'
import ScoreCard from './ScoreCard'

function PRReviewResults({ results }) {
  if (!results || results.length === 0) return (
    <div className="text-center py-8 text-gray-500">
      No reviewable files found in this PR 🎉
    </div>
  )

  return (
    <div className="space-y-8">
      {results.map((fileResult, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
            <span>📄</span>
            <span className="text-blue-400 font-mono text-sm">{fileResult.filename}</span>
          </div>
          <ScoreCard
            score={fileResult.review.score}
            summary={fileResult.review.summary}
          />
          <div className="space-y-3">
            {fileResult.review.issues.map((issue, i) => (
              <IssueCard key={i} issue={issue} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default PRReviewResults