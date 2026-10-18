export const formatDate = (iso) => {
  if (!iso) return ''
  // 소수점 자릿수가 가변이므로 밀리초까지만 사용
  const d = new Date(iso.replace(/(\.\d{3})\d+/, '$1'))
  if (Number.isNaN(d.getTime())) return iso
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

// 관리자 권한 여부 (roleCode 가 ROLE_ADMIN)
export const isAdmin = (user) => user?.roleCode === 'ROLE_ADMIN'
