import { sortNums } from '../utils/lottoUtils'

const KEY = 'lotto-program-items'

export function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {}
}

export function addItem(items, numbers, importance) {
  const item = {
    id: crypto.randomUUID(),
    numbers: sortNums(numbers),
    importance,
    status: 'active',
    createdAt: new Date().toISOString(),
  }
  return [item, ...items]
}

export function updateItem(items, id, numbers, importance) {
  return items.map((it) =>
    it.id === id ? { ...it, numbers: sortNums(numbers), importance } : it,
  )
}

// 완료 처리
export function completeItem(items, id) {
  return items.map((it) => (it.id === id ? { ...it, status: 'done' } : it))
}

// 취소: 완료를 되돌려 진행 상태로 복귀
export function cancelItem(items, id) {
  return items.map((it) => (it.id === id ? { ...it, status: 'active' } : it))
}

export function removeItem(items, id) {
  return items.filter((it) => it.id !== id)
}
