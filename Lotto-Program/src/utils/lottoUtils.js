export const MAX_NUM = 45
export const PICK = 6
export const PAGE_SIZE = 5

export const IMPORTANCE = {
  high: { label: '상', color: '#ff2d2d' },
  mid: { label: '중', color: '#ffd600' },
  low: { label: '하', color: '#2d8cff' },
}

export function validateNumbers(nums) {
  if (nums.length !== PICK || nums.some((n) => n === '' || Number.isNaN(n))) {
    return `${PICK}개의 번호를 모두 입력하세요.`
  }
  if (nums.some((n) => !Number.isInteger(n) || n < 1 || n > MAX_NUM)) {
    return `번호는 1~${MAX_NUM} 사이의 정수여야 합니다.`
  }
  if (new Set(nums).size !== nums.length) return '중복된 번호가 있습니다.'
  return ''
}

export function sortNums(nums) {
  return [...nums].sort((a, b) => a - b)
}

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
