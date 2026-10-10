import Ball from './Ball'
import { IMPORTANCE } from '../utils/lottoUtils'

const btn =
  'border-2 border-white px-3 py-1.5 text-sm font-black hover:bg-white hover:text-black'

export default function NumberCard({ item, onEdit, onComplete, onCancel, onRemove }) {
  const { label, color } = IMPORTANCE[item.importance]
  const done = item.status === 'done'

  return (
    <li
      style={{ borderLeftColor: color }}
      className="flex flex-wrap items-center gap-4 border-2 border-l-[12px] border-white p-4"
    >
      <span
        style={{ background: color }}
        className="flex h-8 w-8 items-center justify-center font-black text-black"
      >
        {label}
      </span>
      <div className={`flex flex-wrap gap-2 ${done ? 'line-through' : ''}`}>
        {item.numbers.map((n) => (
          <Ball key={n} n={n} dim={done} />
        ))}
      </div>
      {done && <span className="bg-white px-2 py-1 text-sm font-black text-black">완료</span>}
      <div className="ml-auto flex gap-2">
        {!done && (
          <button onClick={() => onEdit(item)} className={btn}>
            수정
          </button>
        )}
        {done ? (
          <button onClick={() => onCancel(item.id)} className={btn}>
            취소
          </button>
        ) : (
          <button onClick={() => onComplete(item.id)} className={btn}>
            완료
          </button>
        )}
        <button onClick={() => onRemove(item.id)} className={`${btn} border-red-500 text-red-500`}>
          삭제
        </button>
      </div>
    </li>
  )
}
