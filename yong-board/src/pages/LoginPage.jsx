import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../service/authService.js'
import { getUser } from '../service/userService.js'
import { errorMessage } from '../service/api.js'
import { useAuthStore } from '../stores/authStore.js'

export default function LoginPage() {
  const { token, setToken, setUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const from = useLocation().state?.from || '/posts'
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) return <Navigate to={from} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(userId, password)
      setToken(data.accessToken)
      // 내 정보 조회 API(/me)가 없으므로 입력한 userId 로 상세 조회
      setUser(await getUser(userId))
      navigate(from, { replace: true })
    } catch (err) {
      logout()
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-80 rounded border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-center text-xl font-bold">yong-board 로그인</h1>
        <input
          className="mb-2 w-full rounded border p-2"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          autoFocus
        />
        <input
          className="mb-3 w-full rounded border p-2"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button
          className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
        <p className="mt-4 text-center text-sm">
          계정이 없으신가요? <Link to="/signup" className="text-blue-600 hover:underline">회원가입</Link>
        </p>
      </form>
    </div>
  )
}
