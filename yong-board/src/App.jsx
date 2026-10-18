import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './comp/Layout.jsx'
import RequireAuth from './comp/RequireAuth.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PostListPage from './pages/PostListPage.jsx'
import PostDetailPage from './pages/PostDetailPage.jsx'
import PostFormPage from './pages/PostFormPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import GolfPage from './pages/GolfPage.jsx'
import MemberPage from './pages/MemberPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<Layout />}>
        <Route path="/golf" element={<GolfPage />} />
        {/* 조회: 비로그인 가능 */}
        <Route path="/posts" element={<PostListPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        {/* 등록/수정/회원정보: 로그인 필요 */}
        <Route element={<RequireAuth />}>
          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/:id/edit" element={<PostFormPage />} />
          <Route path="/members" element={<MemberPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/golf" replace />} />
    </Routes>
  )
}
