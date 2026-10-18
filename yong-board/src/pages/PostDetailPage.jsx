import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deletePost, getPost } from '../service/postService.js'
import { errorMessage } from '../service/api.js'
import { useAuthStore } from '../stores/authStore.js'
import { formatDate } from '../utils/format.js'

export default function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch((e) => setError(errorMessage(e)))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return
    try {
      await deletePost(id)
      navigate('/posts')
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  if (error) return <p className="text-red-600">{error}</p>
  if (!post) return <p>로딩 중...</p>

  // 응답에 작성자 userId 가 없어 로그인 상태면 노출하고, 권한 오류(403)는 서버 응답으로 안내한다
  const canEdit = Boolean(token)

  return (
    <div className="rounded border bg-white p-4">
      <h2 className="mb-2 text-xl font-bold">{post.title}</h2>
      <div className="mb-4 flex flex-wrap gap-x-4 border-b pb-3 text-sm text-gray-600">
        <span>글쓴이: {post.writer}</span>
        <span>조회수: {post.viewCount}</span>
        <span>등록일: {formatDate(post.createdAt)}</span>
        <span>수정일: {formatDate(post.updatedAt)}</span>
      </div>
      <p className="min-h-32 whitespace-pre-wrap">{post.content}</p>
      <div className="mt-6 flex gap-2">
        <Link to="/posts" className="rounded border px-3 py-1 hover:bg-gray-100">목록</Link>
        {canEdit && (
          <>
            <Link to={`/posts/${id}/edit`} state={{ post }} className="rounded border px-3 py-1 hover:bg-gray-100">수정</Link>
            <button className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700" onClick={handleDelete}>
              삭제
            </button>
          </>
        )}
      </div>
    </div>
  )
}
