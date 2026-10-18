import api from './api.js'

export const signup = async (user) => (await api.post('/auth/signup', user)).data
export const login = async (userId, password) =>
  (await api.post('/auth/login', { userId, password })).data
