import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore.js'

// 로그인 후 상단 우측: 회원 아이콘 + 이름, 클릭 시 회원정보/로그아웃 드롭다운
export default function UserMenu() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/posts')
  }

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg className="h-7 w-7 text-gray-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
        </svg>
        <span className="text-sm">{user?.userName}</span>
        <span className="text-xs text-gray-400">▾</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-10 mt-1 w-40 rounded border bg-white py-1 shadow-md">
          <div className="border-b px-3 py-1 text-xs text-gray-500">{user?.roleName}</div>
          <button role="menuitem" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100" onClick={() => go('/members')}>
            회원정보
          </button>
          <button role="menuitem" className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  )
}
