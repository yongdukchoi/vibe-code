import api from './api.js'

// params: { page(0부터), size, sort, searchType, keyword }
export const getPosts = async (params) => (await api.get('/boards', { params })).data
// 호출할 때마다 조회수가 1 증가한다
export const getPost = async (id) => (await api.get(`/boards/${id}`)).data
export const createPost = async (post) => (await api.post('/boards', post)).data
export const updatePost = async (id, post) => (await api.put(`/boards/${id}`, post)).data
export const deletePost = async (id) => {
  await api.delete(`/boards/${id}`) // 204, 본문 없음
}
