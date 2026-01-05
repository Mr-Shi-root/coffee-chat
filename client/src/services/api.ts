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
