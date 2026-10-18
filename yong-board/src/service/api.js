import axios from 'axios'
import { useAuthStore } from '../stores/authStore.js'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || ''}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // 토큰 만료/누락(AUTH_REQUIRED) 시 토큰 삭제 → RequireAuth 가 로그인 화면으로 이동시킨다
    if (error.response?.data?.code === 'AUTH_REQUIRED') {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

// 서버 에러 { code, message } 정규화
export const errorCode = (e) => e.response?.data?.code
export const errorMessage = (e) => {
  if (errorCode(e) === 'ACCESS_DENIED') return '작성자(본인)만 수정/삭제할 수 있습니다.'
  return e.response?.data?.message || e.message
}

export default api
