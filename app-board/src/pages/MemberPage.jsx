import { useEffect, useState } from 'react'
import { deleteUser, getUsers, updateUser } from '../service/userService.js'
import { errorMessage } from '../service/api.js'
import { useAuthStore } from '../stores/authStore.js'
import { isAdmin } from '../utils/format.js'
import Pagination from '../comp/Pagination.jsx'

// 회원 정보 수정/탈퇴는 관리자 권한(ROLE_ADMIN)일 때만 가능하다
export default function MemberPage() {
  const me = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const admin = isAdmin(me)
  const [data, setData] = useState(null)
  const [query, setQuery] = useState({ page: 0, keyword: '' })
  const [keywordInput, setKeywordInput] = useState('')
  const [form, setForm] = useState(null) // 수정 중인 회원
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const params = { page: query.page, size: 10 }
      if (query.keyword.trim()) params.keyword = query.keyword.trim()
      setData(await getUsers(params))
    } catch (e) {
      setError(errorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [query])

  const change = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery({ page: 0, keyword: keywordInput })
  }

  const handleEdit = (u) => {
    setError('')
    setForm({ userId: u.userId, userName: u.userName, birthDate: u.birthDate, gender: u.gender, password: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.userName.trim() || form.userName.length > 50) return setError('이름은 필수이며 최대 50자입니다.')
    if (!form.birthDate) return setError('생년월일을 입력해주세요.')
    if (form.password && (form.password.length < 8 || form.password.length > 100)) {
      return setError('비밀번호는 8~100자여야 합니다.')
    }
    // 비밀번호를 변경하지 않으면 필드를 보내지 않는다 (빈 문자열은 검증 실패)
    const body = { userName: form.userName, birthDate: form.birthDate, gender: form.gender }
    if (form.password) body.password = form.password
    try {
      const saved = await updateUser(form.userId, body)
      if (saved.userId === me?.userId) useAuthStore.getState().setUser(saved)
      setForm(null)
      await load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const handleDelete = async (u) => {
    if (!confirm(`${u.userName}(${u.userId}) 회원을 탈퇴 처리하시겠습니까?\n해당 회원이 작성한 게시글도 함께 삭제됩니다.`)) return
    setError('')
    try {
      await deleteUser(u.userId)
      if (form?.userId === u.userId) setForm(null)
      if (u.userId === me?.userId) return logout() // 본인 탈퇴 시 로그아웃 처리
      await load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const users = data?.content ?? []

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">회원정보</h2>

      {admin && form && (
        <form onSubmit={handleSubmit} className="mb-6 rounded border bg-white p-4">
          <h3 className="mb-3 font-semibold">회원 수정 ({form.userId})</h3>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <input className="rounded border p-2" placeholder="이름" value={form.userName} onChange={change('userName')} />
            <input className="rounded border p-2" type="date" value={form.birthDate} onChange={change('birthDate')} />
            <select className="rounded border p-2" value={form.gender} onChange={change('gender')}>
              <option value="남자">남자</option>
              <option value="여자">여자</option>
            </select>
            <input className="rounded border p-2" type="password" placeholder="비밀번호 (변경 시에만)" value={form.password} onChange={change('password')} />
          </div>
          <div className="mt-3 flex gap-2">
            <button className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700">수정</button>
            <button type="button" className="rounded border px-4 py-1 hover:bg-gray-100" onClick={() => setForm(null)}>
              취소
            </button>
          </div>
        </form>
      )}

      <form onSubmit={handleSearch} className="mb-3 flex gap-1">
        <input className="rounded border p-1 text-sm" placeholder="이름 검색" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} />
        <button className="rounded border px-3 py-1 text-sm hover:bg-gray-100">검색</button>
      </form>

      {loading && <p>로딩 중...</p>}
      {error && <p className="mb-3 text-red-600">{error}</p>}

      <table className="w-full border bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">아이디</th>
            <th className="p-2">이름</th>
            <th className="p-2">생년월일</th>
            <th className="p-2">성별</th>
            <th className="p-2">권한</th>
            {admin && <th className="p-2">관리</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.userId} className="border-t text-center">
              <td className="p-2">{u.userId}</td>
              <td className="p-2">{u.userName}</td>
              <td className="p-2">{u.birthDate}</td>
              <td className="p-2">{u.gender}</td>
              <td className="p-2">{u.roleName}</td>
              {admin && (
                <td className="p-2">
                  <button className="mr-2 rounded border px-2 py-0.5 hover:bg-gray-100" onClick={() => handleEdit(u)}>
                    수정
                  </button>
                  <button className="rounded bg-red-600 px-2 py-0.5 text-white hover:bg-red-700" onClick={() => handleDelete(u)}>
                    탈퇴
                  </button>
                </td>
              )}
            </tr>
          ))}
          {!loading && users.length === 0 && (
            <tr>
              <td colSpan={admin ? 6 : 5} className="p-6 text-center text-gray-500">회원이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination page={data} onChange={(p) => setQuery({ ...query, page: p })} />
    </div>
  )
}
