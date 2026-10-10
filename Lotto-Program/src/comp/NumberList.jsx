import { useState } from 'react'
import NumberCard from './NumberCard'
import { PAGE_SIZE } from '../utils/lottoUtils'

export default function NumberList({ items, ...handlers }) {
  const [pageRaw, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const page = Math.min(pageRaw, totalPages)

  const slice = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section>
      <h2 className="mb-4 text-xl font-black tracking-widest">
        내 번호 <span className="text-white/60">({items.length})</span>
      </h2>
      {items.length === 0 ? (
        <p className="border-2 border-dashed border-white/50 p-8 text-center font-bold text-white/60">
          등록된 번호가 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {slice.map((it) => (
            <NumberCard key={it.id} item={it} {...handlers} />
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <nav className="mt-5 flex items-center justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="border-2 border-white px-3 py-1 font-black disabled:opacity-30"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 border-2 border-white font-black ${p === page ? 'bg-white text-black' : ''}`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="border-2 border-white px-3 py-1 font-black disabled:opacity-30"
          >
            ›
          </button>
        </nav>
      )}
    </section>
  )
}
