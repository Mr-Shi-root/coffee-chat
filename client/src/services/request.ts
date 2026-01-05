import Taro from '@tarojs/taro'

// API base URL - change this to your server address
const BASE_URL = 'http://localhost:3000/api'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: Record<string, string>
}

interface Response<T = any> {
  code: number
  message: string
  data: T
}

const request = async <T = any>(options: RequestOptions): Promise<Response<T>> => {
  const { url, method = 'GET', data, header = {} } = options

  // Get token from storage
  const token = Taro.getStorageSync('token')
  if (token) {
    header['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await Taro.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
    })

    const result = response.data as Response<T>

    // Handle unauthorized
    if (result.code === 401) {
      Taro.removeStorageSync('token')
      Taro.showToast({ title: '请重新登录', icon: 'none' })
    }

    return result
  } catch (error) {
    console.error('Request error:', error)
    throw error
  }
}

export default request
