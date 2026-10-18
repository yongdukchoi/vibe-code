import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../service/postService.js'
import { errorMessage } from '../service/api.js'
import { useAuthStore } from '../stores/authStore.js'
import { formatDate } from '../utils/format.js'
import Pagination from '../comp/Pagination.jsx'

const SORTS = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'createdAt,asc', label: '오래된순' },
  { value: 'viewCount,desc', label: '조회수순' },
  { value: 'title,asc', label: '제목순' },
]

export default function PostListPage() {
  const token = useAuthStore((s) => s.token)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState({ page: 0, sort: 'createdAt,desc', searchType: 'title', keyword: '' })
  const [input, setInput] = useState({ searchType: 'title', keyword: '' })

  useEffect(() => {
    setLoading(true)
    setError('')
    const params = { page: query.page, size: 10, sort: query.sort }
    if (query.keyword.trim()) {
      params.searchType = query.searchType
      params.keyword = query.keyword.trim()
    }
    getPosts(params)
      .then(setData)
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false))
  }, [query])

  const handleSearch = (e) => {
    e.preventDefault()
    setQuery({ ...query, ...input, page: 0 })
  }

  const posts = data?.content ?? []

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">게시판</h2>
        <Link to="/posts/new" className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700">
          {token ? '글쓰기' : '로그인 후 글쓰기'}
        </Link>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <form onSubmit={handleSearch} className="flex gap-1">
          <select className="rounded border p-1 text-sm" value={input.searchType} onChange={(e) => setInput({ ...input, searchType: e.target.value })}>
            <option value="title">제목</option>
            <option value="writer">작성자</option>
          </select>
          <input className="rounded border p-1 text-sm" placeholder="검색어" value={input.keyword} onChange={(e) => setInput({ ...input, keyword: e.target.value })} />
          <button className="rounded border px-3 py-1 text-sm hover:bg-gray-100">검색</button>
        </form>
        <select className="rounded border p-1 text-sm" value={query.sort} onChange={(e) => setQuery({ ...query, sort: e.target.value, page: 0 })}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading && <p>로딩 중...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full border bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-16 p-2">번호</th>
            <th className="p-2 text-left">제목</th>
            <th className="w-28 p-2">글쓴이</th>
            <th className="w-16 p-2">조회수</th>
            <th className="w-40 p-2">등록일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-2 text-center">{p.id}</td>
              <td className="p-2">
                <Link to={`/posts/${p.id}`} className="hover:underline">{p.title}</Link>
              </td>
              <td className="p-2 text-center">{p.writer}</td>
              <td className="p-2 text-center">{p.viewCount}</td>
              <td className="p-2 text-center">{formatDate(p.createdAt)}</td>
            </tr>
          ))}
          {!loading && posts.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination page={data} onChange={(p) => setQuery({ ...query, page: p })} />
    </div>
  )
}
