function ScoreCard({ score, summary }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBar = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm">Code Quality Score</p>
          <p className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score}<span className="text-2xl text-gray-500">/100</span>
          </p>
        </div>
        <div className="text-6xl">
          {score >= 80 ? '😎' : score >= 60 ? '😐' : '😬'}
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getScoreBar(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-gray-300 text-sm">{summary}</p>
    </div>
  )
}

export default ScoreCard