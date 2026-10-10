import { useState } from 'react'
import Ball from './Ball'
import { getPeriod, recommend } from '../service/recommendService'

export default function Recommend({ onUse }) {
  const [rec, setRec] = useState(() => recommend())
  const { from, to, count } = getPeriod()

  return (
    <section className="border-4 border-white p-5">
      <h2 className="mb-1 text-xl font-black tracking-widest">추천 번호</h2>
      <p className="mb-4 text-sm text-white/60">
        최근 1년 {count}회차 ({from.round}~{to.round}회) 기준 · 파랑 4개: 안 나온 번호 / 빨강 2개: 가장 많이 나온 번호
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {rec.cold.map((n) => (
          <Ball key={n} n={n} tone="cold" />
        ))}
        {rec.hot.map((n) => (
          <Ball key={n} n={n} tone="hot" />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setRec(recommend())}
          className="border-2 border-white px-5 py-2 font-black hover:bg-white hover:text-black"
        >
          다시 생성
        </button>
        <button
          onClick={() => onUse([...rec.cold, ...rec.hot])}
          className="bg-white px-5 py-2 font-black text-black hover:bg-yellow-300"
        >
          입력창에 넣기
        </button>
      </div>
    </section>
  )
}
