import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore.js'
import UserMenu from './UserMenu.jsx'

const menuClass = ({ isActive }) =>
  `rounded px-3 py-1 ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`

// 공통 상단 메뉴 레이아웃 (게시판 조회는 비로그인도 가능)
export default function Layout() {
  const token = useAuthStore((s) => s.token)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <nav className="flex items-center gap-2">
            <span className="mr-4 text-lg font-bold">app-board</span>
            <NavLink to="/posts" className={menuClass}>게시판</NavLink>
          </nav>
          {token ? (
            <UserMenu />
          ) : (
            <Link to="/login" className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
              로그인
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
