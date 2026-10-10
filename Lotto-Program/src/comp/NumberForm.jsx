import { useEffect, useState } from 'react'
import { IMPORTANCE, PICK, validateNumbers } from '../utils/lottoUtils'

const empty = () => Array(PICK).fill('')

export default function NumberForm({ editing, preset, onSubmit, onCancelEdit }) {
  const [nums, setNums] = useState(empty())
  const [importance, setImportance] = useState('mid')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setNums(editing.numbers.map(String))
      setImportance(editing.importance)
      setError('')
    }
  }, [editing])

  useEffect(() => {
    if (preset) {
      setNums(preset.map(String))
      setError('')
    }
  }, [preset])

  const change = (i, v) => {
    const next = [...nums]
    next[i] = v.replace(/\D/g, '').slice(0, 2)
    setNums(next)
  }

  const submit = (e) => {
    e.preventDefault()
    const parsed = nums.map((v) => (v === '' ? '' : Number(v)))
    const msg = validateNumbers(parsed)
    if (msg) return setError(msg)
    onSubmit(parsed, importance)
    setNums(empty())
    setError('')
  }

  return (
    <form onSubmit={submit} className="border-4 border-white p-5">
      <h2 className="mb-4 text-xl font-black tracking-widest">
        {editing ? '번호 수정' : '번호 등록'}
      </h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {nums.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => change(i, e.target.value)}
            inputMode="numeric"
            placeholder="-"
            className="h-12 w-14 border-2 border-white bg-black text-center text-xl font-black outline-none focus:bg-white focus:text-black"
          />
        ))}
      </div>
      <div className="mb-4 flex items-center gap-2">
        <span className="mr-2 font-bold">중요도</span>
        {Object.entries(IMPORTANCE).map(([key, { label, color }]) => (
          <button
            type="button"
            key={key}
            onClick={() => setImportance(key)}
            style={importance === key ? { background: color, borderColor: color } : {}}
            className={`h-10 w-12 border-2 border-white font-black ${importance === key ? 'text-black' : 'text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <p className="mb-3 font-bold text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button className="bg-white px-6 py-3 font-black text-black hover:bg-yellow-300">
          {editing ? '수정 완료' : '등록'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="border-2 border-white px-6 py-3 font-black hover:bg-white hover:text-black"
          >
            수정 취소
          </button>
        )}
      </div>
    </form>
  )
}
