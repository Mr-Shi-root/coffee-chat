import { View, Text, Switch, Picker, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { getSettings, updateSettings, resetSettings, SettingsData } from '@/services/api'
import './index.scss'

const themeOptions = ['浅色', '深色', '跟随系统']
const themeValues: SettingsData['theme'][] = ['light', 'dark', 'auto']

const languageOptions = ['简体中文', 'English']
const languageValues: SettingsData['language'][] = ['zh-CN', 'en-US']

const fontSizeOptions = ['小', '中', '大']
const fontSizeValues: SettingsData['fontSize'][] = ['small', 'medium', 'large']

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    theme: 'light',
    notification: true,
    language: 'zh-CN',
    fontSize: 'medium',
  })
  const [loading, setLoading] = useState(true)

  // 检查登录状态并加载设置
  useEffect(() => {
    const token = Taro.getStorageSync('token')
    console.log('Settings page - token:', token ? 'exists' : 'not found')

    if (!token) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      Taro.navigateBack()
      return
    }
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await getSettings()
      if (res.code === 0) {
        setSettings(res.data)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
    } finally {
      setLoading(false)
    }
  }

  // 更新单个设置
  const handleUpdateSetting = async <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    try {
      const res = await updateSettings({ [key]: value })
      if (res.code === 0) {
        setSettings(res.data)
        Taro.showToast({ title: '设置已保存', icon: 'success' })
      }
    } catch (err) {
      Taro.showToast({ title: '保存失败', icon: 'error' })
    }
  }

  // 重置设置
  const handleReset = async () => {
    try {
      const { confirm } = await Taro.showModal({
        title: '提示',
        content: '确定要重置所有设置吗？',
      })
      if (confirm) {
        const res = await resetSettings()
        if (res.code === 0) {
          setSettings(res.data)
          Taro.showToast({ title: '已重置', icon: 'success' })
        }
      }
    } catch (err) {
      Taro.showToast({ title: '重置失败', icon: 'error' })
    }
  }

  if (loading) {
    return (
      <View className='settings loading'>
        <Text>加载中...</Text>
      </View>
    )
  }

  return (
    <View className='settings'>
      <View className='section'>
        <Text className='section-title'>显示设置</Text>

        {/* 主题 */}
        <View className='setting-item'>
          <Text className='label'>主题</Text>
          <Picker
            mode='selector'
            range={themeOptions}
            value={themeValues.indexOf(settings.theme)}
            onChange={(e) => {
              const index = Number(e.detail.value)
              handleUpdateSetting('theme', themeValues[index])
            }}
          >
            <Text className='value'>
              {themeOptions[themeValues.indexOf(settings.theme)]} &gt;
            </Text>
          </Picker>
        </View>

        {/* 字体大小 */}
        <View className='setting-item'>
          <Text className='label'>字体大小</Text>
          <Picker
            mode='selector'
            range={fontSizeOptions}
            value={fontSizeValues.indexOf(settings.fontSize)}
            onChange={(e) => {
              const index = Number(e.detail.value)
              handleUpdateSetting('fontSize', fontSizeValues[index])
            }}
          >
            <Text className='value'>
              {fontSizeOptions[fontSizeValues.indexOf(settings.fontSize)]} &gt;
            </Text>
          </Picker>
        </View>

        {/* 语言 */}
        <View className='setting-item'>
          <Text className='label'>语言</Text>
          <Picker
            mode='selector'
            range={languageOptions}
            value={languageValues.indexOf(settings.language)}
            onChange={(e) => {
              const index = Number(e.detail.value)
              handleUpdateSetting('language', languageValues[index])
            }}
          >
            <Text className='value'>
              {languageOptions[languageValues.indexOf(settings.language)]} &gt;
            </Text>
          </Picker>
        </View>
      </View>

      <View className='section'>
        <Text className='section-title'>通知设置</Text>

        {/* 通知开关 */}
        <View className='setting-item'>
          <Text className='label'>接收通知</Text>
          <Switch
            checked={settings.notification}
            onChange={(e) => handleUpdateSetting('notification', e.detail.value)}
            color='#07c160'
          />
        </View>
      </View>

      <View className='section'>
        <Text className='section-title'>其他</Text>

        <Button className='reset-btn' onClick={handleReset}>
          重置所有设置
        </Button>
      </View>

      {/* 当前设置预览（开发调试用） */}
      <View className='debug-section'>
        <Text className='section-title'>当前设置（调试）</Text>
        <Text className='debug-text'>{JSON.stringify(settings, null, 2)}</Text>
      </View>
    </View>
  )
}
