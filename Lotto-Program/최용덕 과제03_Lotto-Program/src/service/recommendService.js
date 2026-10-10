import history from '../data/lottoHistory.json'
import { MAX_NUM, shuffle, sortNums } from '../utils/lottoUtils'

// 데이터 기준일(가장 최근 회차)로부터 최근 1년 회차만 사용
function recentYear() {
  const latest = new Date(history[history.length - 1].date)
  const from = new Date(latest)
  from.setFullYear(from.getFullYear() - 1)
  return history.filter((h) => new Date(h.date) > from)
}

export function getFrequency() {
  const freq = Array(MAX_NUM + 1).fill(0)
  recentYear().forEach((h) => h.numbers.forEach((n) => freq[n]++))
  return freq
}

export function getPeriod() {
  const rounds = recentYear()
  return { from: rounds[0], to: rounds[rounds.length - 1], count: rounds.length }
}

// 미출현(가장 적게 나온) 4개 + 최다 출현 2개
export function recommend() {
  const freq = getFrequency()
  const all = Array.from({ length: MAX_NUM }, (_, i) => i + 1)

  // 출현 횟수가 적은 순으로 단계(tier)를 채워 4개 선택
  const cold = []
  const counts = [...new Set(all.map((n) => freq[n]))].sort((a, b) => a - b)
  for (const c of counts) {
    const tier = shuffle(all.filter((n) => freq[n] === c))
    cold.push(...tier.slice(0, 4 - cold.length))
    if (cold.length >= 4) break
  }

  // 가장 많이 나온 상위 6개 중 2개 (미출현 선택과 겹치지 않게)
  const hotPool = all
    .filter((n) => !cold.includes(n))
    .sort((a, b) => freq[b] - freq[a])
    .slice(0, 6)
  const hot = shuffle(hotPool).slice(0, 2)

  return { cold: sortNums(cold), hot: sortNums(hot) }
}
