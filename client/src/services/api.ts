import request from './request'

// User APIs
export const login = (code: string) => {
  return request({
    url: '/user/login',
    method: 'POST',
    data: { code },
  })
}

export const getUserInfo = () => {
  return request({
    url: '/user/info',
    method: 'GET',
  })
}

export const updateUserInfo = (data: { nickname?: string; avatar?: string; gender?: number }) => {
  return request({
    url: '/user/info',
    method: 'PUT',
    data,
  })
}

// Settings APIs
export interface SettingsData {
  theme: 'light' | 'dark' | 'auto'
  notification: boolean
  language: 'zh-CN' | 'en-US'
  fontSize: 'small' | 'medium' | 'large'
}

export const getSettings = () => {
  return request<SettingsData>({
    url: '/settings',
    method: 'GET',
  })
}

export const updateSettings = (data: Partial<SettingsData>) => {
  return request<SettingsData>({
    url: '/settings',
    method: 'PUT',
    data,
  })
}

export const resetSettings = () => {
  return request<SettingsData>({
    url: '/settings/reset',
    method: 'POST',
  })
}
