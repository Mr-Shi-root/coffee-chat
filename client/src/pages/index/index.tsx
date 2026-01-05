import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { login } from '@/services/api'
import './index.scss'

export default function Index() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const token = Taro.getStorageSync('token')
    if (token) {
      setIsLoggedIn(true)
      const savedUserInfo = Taro.getStorageSync('userInfo')
      if (savedUserInfo) {
        setUserInfo(savedUserInfo)
      }
    }
  }, [])

  const handleLogin = async () => {
    try {
      const { code } = await Taro.login()
      const res = await login(code)
      if (res.code === 0) {
        Taro.setStorageSync('token', res.data.token)
        Taro.setStorageSync('userInfo', res.data.userInfo)
        setUserInfo(res.data.userInfo)
        setIsLoggedIn(true)
        Taro.showToast({ title: '登录成功', icon: 'success' })
      }
    } catch (err) {
      console.error('Login failed:', err)
      Taro.showToast({ title: '登录失败', icon: 'error' })
    }
  }

  const handleLogout = () => {
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('userInfo')
    setUserInfo(null)
    setIsLoggedIn(false)
    Taro.showToast({ title: '已退出登录', icon: 'success' })
  }

  const goToSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/index' })
  }

  return (
    <View className='index'>
      <View className='header'>
        <Text className='title'>Coffee Chat</Text>
        <Text className='subtitle'>一起喝杯咖啡吧</Text>
      </View>

      <View className='content'>
        {isLoggedIn ? (
          <View className='user-section'>
            <View className='user-info'>
              <Text className='welcome'>欢迎, {userInfo?.nickname || '新用户'}</Text>
            </View>

            <View className='menu-list'>
              <Button className='menu-btn' onClick={goToSettings}>
                设置
              </Button>
              <Button className='menu-btn logout-btn' onClick={handleLogout}>
                退出登录
              </Button>
            </View>
          </View>
        ) : (
          <Button className='login-btn' onClick={handleLogin}>
            微信登录
          </Button>
        )}
      </View>
    </View>
  )
}
