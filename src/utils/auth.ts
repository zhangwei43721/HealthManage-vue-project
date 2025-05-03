const TOKEN_KEY = 'token'
const TOKEN_EXPIRE_KEY = 'tokenExpire'
const DEFAULT_EXPIRE_DURATION = 12 * 60 * 60 * 1000 // 12 hours

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY)
  const expireTime = localStorage.getItem(TOKEN_EXPIRE_KEY)

  if (!token || !expireTime) {
    return false
  }

  const now = new Date().getTime()
  return now < parseInt(expireTime)
}

export const getToken = (): string | null => {
  if (isAuthenticated()) {
    return localStorage.getItem(TOKEN_KEY)
  }
  clearAuth() // 如果过期或无效，清除
  return null
}

export const setAuth = (token: string): void => {
  const expireTime = new Date().getTime() + DEFAULT_EXPIRE_DURATION
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(TOKEN_EXPIRE_KEY, expireTime.toString())
}

export const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRE_KEY)
}
