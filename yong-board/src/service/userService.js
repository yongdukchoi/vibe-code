import api from './api.js'

export const getUsers = async (params) => (await api.get('/users', { params })).data
export const getUser = async (userId) => (await api.get(`/users/${userId}`)).data
export const updateUser = async (userId, user) => (await api.put(`/users/${userId}`, user)).data
export const deleteUser = async (userId) => {
  await api.delete(`/users/${userId}`) // 204, 본문 없음
}
