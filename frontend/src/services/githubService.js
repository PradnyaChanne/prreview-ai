import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID

export const loginWithGitHub = () => {
  const redirectUri = `${window.location.origin}/callback`
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo&redirect_uri=${redirectUri}`
}

export const exchangeCodeForToken = async (code) => {
  const response = await axios.post(`${API_URL}/api/github/token`, { code })
  return response.data.accessToken
}

export const getRepos = async (token) => {
  const response = await axios.get(`${API_URL}/api/github/repos`, {
    headers: { 'X-GitHub-Token': token }
  })
  return response.data
}

export const getPullRequests = async (token, owner, repo) => {
  const response = await axios.get(`${API_URL}/api/github/repos/${owner}/${repo}/pulls`, {
    headers: { 'X-GitHub-Token': token }
  })
  return response.data
}

export const reviewPR = async (token, owner, repo, prNumber) => {
  const response = await axios.get(
    `${API_URL}/api/github/repos/${owner}/${repo}/pulls/${prNumber}/review`,
    { headers: { 'X-GitHub-Token': token } }
  )
  return response.data
}