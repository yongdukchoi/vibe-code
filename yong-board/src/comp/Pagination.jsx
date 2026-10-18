// 서버 페이지(0부터)를 UI 1부터로 변환하는 페이지 이동 컴포넌트
export default function Pagination({ page, onChange }) {
  if (!page || page.totalPages <= 1) return null
  const cur = page.number + 1
  const total = page.totalPages
  const start = Math.max(1, Math.min(cur - 2, total - 4))
  const nums = []
  for (let i = start; i <= Math.min(total, start + 4); i++) nums.push(i)
  const btn = 'rounded border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-40'

  return (
    <div className="mt-4 flex justify-center gap-1">
      <button className={btn} disabled={page.first} onClick={() => onChange(page.number - 1)}>이전</button>
      {nums.map((n) => (
        <button
          key={n}
          className={`${btn} ${n === cur ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}`}
          onClick={() => onChange(n - 1)}
        >
          {n}
        </button>
      ))}
      <button className={btn} disabled={page.last} onClick={() => onChange(page.number + 1)}>다음</button>
    </div>
  )
}
