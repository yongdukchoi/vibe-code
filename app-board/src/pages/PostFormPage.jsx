import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { createPost, getPost, updatePost } from '../service/postService.js'
import { errorMessage } from '../service/api.js'

// /posts/new (등록) 와 /posts/:id/edit (수정) 공용 화면
export default function PostFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const passed = useLocation().state?.post // 상세 화면에서 넘겨받은 글 (조회수 증가 방지)
  const [title, setTitle] = useState(passed?.title ?? '')
  const [content, setContent] = useState(passed?.content ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // 직접 URL 로 진입한 경우에만 조회한다 (상세 조회는 조회수가 증가함)
    if (!isEdit || passed) return
    getPost(id)
      .then((p) => {
        setTitle(p.title)
        setContent(p.content)
      })
      .catch((e) => setError(errorMessage(e)))
  }, [id, isEdit, passed])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return setError('제목과 내용을 입력해주세요.')
    if (title.length > 200) return setError('제목은 최대 200자입니다.')
    setError('')
    setSaving(true)
    try {
      const saved = isEdit ? await updatePost(id, { title, content }) : await createPost({ title, content })
      navigate(`/posts/${saved.id}`)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded border bg-white p-4">
      <h2 className="mb-4 text-xl font-bold">{isEdit ? '게시글 수정' : '게시글 등록'}</h2>
      <input
        className="mb-3 w-full rounded border p-2"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="mb-3 h-64 w-full rounded border p-2"
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 disabled:opacity-50" disabled={saving}>
          {isEdit ? '수정' : '등록'}
        </button>
        <button type="button" className="rounded border px-4 py-1 hover:bg-gray-100" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </form>
  )
}
