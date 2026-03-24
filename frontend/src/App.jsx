import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import LanguageSelector from './components/LanguageSelector'
import ReviewResults from './components/ReviewResults'
import GitHubLogin from './components/GitHubLogin'
import RepoSelector from './components/RepoSelector'
import PRList from './components/PRList'
import PRReviewResults from './components/PRReviewResults'
import Callback from './pages/Callback'
import { reviewCode } from './services/reviewService'
import { getRepos, getPullRequests, reviewPR } from './services/githubService'

function App() {
  const [code, setCode] = useState('// Paste your code here...')
  const [language, setLanguage] = useState('javascript')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('paste')

  // GitHub state
  const [githubToken, setGithubToken] = useState(
    localStorage.getItem('github_token') || null
  )
  const [repos, setRepos] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [prs, setPRs] = useState([])
  const [prLoading, setPRLoading] = useState(false)
  const [prReviewResults, setPRReviewResults] = useState(null)
  const [prReviewLoading, setPRReviewLoading] = useState(false)

  // Handle GitHub callback
  if (window.location.pathname === '/callback') {
    return <Callback onLogin={(token) => setGithubToken(token)} />
  }

  useEffect(() => {
    if (githubToken) {
      getRepos(githubToken).then(setRepos).catch(() => {
        localStorage.removeItem('github_token')
        setGithubToken(null)
      })
    }
  }, [githubToken])

  useEffect(() => {
    if (selectedRepo && githubToken) {
      setPRLoading(true)
      const [owner, repo] = selectedRepo.fullName.split('/')
      getPullRequests(githubToken, owner, repo)
        .then(setPRs)
        .finally(() => setPRLoading(false))
    }
  }, [selectedRepo])

  const handleReview = async () => {
    if (!code.trim() || code === '// Paste your code here...') {
      setError('Please paste some code to review')
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    setActiveCategory('all')
    try {
      const data = await reviewCode(code, language)
      setResult(data)
    } catch (err) {
      setError('Failed to get review. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handlePRSelect = async (pr) => {
    setPRReviewResults(null)
    setPRReviewLoading(true)
    const [owner, repo] = selectedRepo.fullName.split('/')
    try {
      const results = await reviewPR(githubToken, owner, repo, pr.number)
      setPRReviewResults(results)
    } catch (err) {
      setError('Failed to review PR')
    } finally {
      setPRReviewLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <h1 className="text-xl font-bold text-white">PRReview AI</h1>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/PradnyaChanne/prreview-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors"
            >
              ⭐ Star on GitHub
            </a>
            {!githubToken ? (
              <GitHubLogin />
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('github_token')
                  setGithubToken(null)
                  setRepos([])
                  setSelectedRepo(null)
                }}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'paste'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📋 Paste Code
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'github'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🐙 GitHub PRs
          </button>
        </div>

        {/* Paste Code Tab */}
        {activeTab === 'paste' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-200">Your Code</h2>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-700">
                <Editor
                  height="450px"
                  language={language}
                  value={code}
                  onChange={(val) => setCode(val || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                  }}
                />
              </div>
              <button
                onClick={handleReview}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Reviewing...
                  </>
                ) : <>Review Code →</>}
              </button>
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Review Results</h2>
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-700 rounded-lg text-gray-500">
                  <span className="text-4xl mb-3">👈</span>
                  <p>Paste your code and click Review</p>
                </div>
              )}
              {loading && (
                <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-700 rounded-lg text-gray-500">
                  <span className="text-4xl mb-3 animate-bounce">🤖</span>
                  <p>AI is reviewing your code...</p>
                </div>
              )}
              {result && (
                <ReviewResults
                  result={result}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              )}
            </div>
          </div>
        )}

        {/* GitHub PRs Tab */}
        {activeTab === 'github' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {!githubToken ? (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-lg gap-4">
                  <p className="text-gray-400">Login with GitHub to review your PRs</p>
                  <GitHubLogin />
                </div>
              ) : (
                <>
                  <RepoSelector
                    repos={repos}
                    selectedRepo={selectedRepo}
                    onSelect={setSelectedRepo}
                  />
                  {selectedRepo && (
                    <PRList
                      prs={prs}
                      onSelect={handlePRSelect}
                      loading={prLoading}
                    />
                  )}
                </>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-4">PR Review Results</h2>
              {prReviewLoading && (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-lg text-gray-500">
                  <span className="text-4xl mb-3 animate-bounce">🤖</span>
                  <p>Reviewing PR files...</p>
                </div>
              )}
              {!prReviewResults && !prReviewLoading && (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-lg text-gray-500">
                  <span className="text-4xl mb-3">👈</span>
                  <p>Select a PR to review</p>
                </div>
              )}
              {prReviewResults && (
                <PRReviewResults results={prReviewResults} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-gray-500 text-sm">
          <p>Built by <a href="https://github.com/PradnyaChanne" className="text-blue-400 hover:underline">Pradnya Channe</a></p>
          <p>Powered by OpenAI GPT</p>
        </div>
      </footer>
    </div>
  )
}

export default App