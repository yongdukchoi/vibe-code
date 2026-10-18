import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../service/authService.js'
import { errorMessage } from '../service/api.js'

const EMPTY = { userId: '', password: '', userName: '', birthDate: '', gender: '남자' }

// 클라이언트 검증 (서버 검증과 동일)
const validate = (f) => {
  if (f.userId.length < 4 || f.userId.length > 50) return '아이디는 4~50자여야 합니다.'
  if (f.password.length < 8 || f.password.length > 100) return '비밀번호는 8~100자여야 합니다.'
  if (!f.userName.trim() || f.userName.length > 50) return '이름은 필수이며 최대 50자입니다.'
  if (!f.birthDate) return '생년월일을 입력해주세요.'
  return ''
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const msg = validate(form)
    if (msg) return setError(msg)
    setError('')
    setSaving(true)
    try {
      await signup(form)
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-96 rounded border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-center text-xl font-bold">회원가입</h1>
        <input className="mb-2 w-full rounded border p-2" placeholder="아이디 (4~50자)" value={form.userId} onChange={change('userId')} autoFocus />
        <input className="mb-2 w-full rounded border p-2" type="password" placeholder="비밀번호 (8~100자)" value={form.password} onChange={change('password')} />
        <input className="mb-2 w-full rounded border p-2" placeholder="이름" value={form.userName} onChange={change('userName')} />
        <input className="mb-2 w-full rounded border p-2" type="date" value={form.birthDate} onChange={change('birthDate')} />
        <select className="mb-3 w-full rounded border p-2" value={form.gender} onChange={change('gender')}>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
        </select>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50" disabled={saving}>
          {saving ? '처리 중...' : '가입하기'}
        </button>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">로그인으로 돌아가기</Link>
        </p>
      </form>
    </div>
  )
}
