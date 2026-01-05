import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { login } from '@/services/api'
import './index.scss'

export default function Index() {
  const [userInfo, setUserInfo] = useState<any>(null)

  const handleLogin = async () => {
    try {
      const { code } = await Taro.login()
      const res = await login(code)
      if (res.code === 0) {
        Taro.setStorageSync('token', res.data.token)
        setUserInfo(res.data.userInfo)
        Taro.showToast({ title: '登录成功', icon: 'success' })
      }
    } catch (err) {
      console.error('Login failed:', err)
      Taro.showToast({ title: '登录失败', icon: 'error' })
    }
  }

  return (
    <View className='index'>
      <View className='header'>
        <Text className='title'>Coffee Chat</Text>
        <Text className='subtitle'>一起喝杯咖啡吧</Text>
      </View>

      <View className='content'>
        {userInfo ? (
          <View className='user-info'>
            <Text>欢迎, {userInfo.nickname || '新用户'}</Text>
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
