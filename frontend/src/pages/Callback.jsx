import { useEffect } from 'react'
import { exchangeCodeForToken } from '../services/githubServices'

function Callback({ onLogin }) {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      exchangeCodeForToken(code).then((token) => {
        localStorage.setItem('github_token', token)
        onLogin(token)
        window.location.href = '/'
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center text-gray-400">
        <span className="text-4xl animate-bounce block mb-4">🔄</span>
        Logging you in with GitHub...
      </div>
    </div>
  )
}

export default Callback