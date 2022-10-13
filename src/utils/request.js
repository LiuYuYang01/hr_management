import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
// Token到期时间 以秒为单位
const TimeOut = 60 * 60 * 9999 // 一天后到期

// 创建axios实例对象
const service = axios.create({
  // 接口请求前缀
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置超时时间
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    // 每次前端请求后端接口都需要携带token会比较麻烦，所以在这个位置需要统一的去注入token
    if (store.getters.token) {
      // 在有token的情况下 才有必要去检查时间戳是否超时
      if (IsCheckTimeOut()) {
        // 如果它为true表示过期了。token也就因为超时没用了
        store.dispatch('user/logout') // 登出操作
        // 跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }

      // 如果token存在 注入token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use((res) => {
  // success为true代表登录成功，反之失败
  const { success, message } = res.data

  if (success) {
    return res.data
  } else {
    // 如果登录失败就返回失败信息
    return Promise.reject(message)
  }
})

// 判断Token是否到期
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间戳
  const timeStamp = getTimeStamp() // 缓存时间戳

  // 求出到期的时间戳：当前时间戳 - 缓存时间戳 = 剩余时间戳（毫秒）
  // 再把剩余时间戳（毫秒） / 1000 求出以秒为单位的到期时间
  // TimeOut是自己设置的到期时间，如果剩余秒大于了TimeOut就证明到期了，然后返回true。否则false
  return (currentTime - timeStamp) / 1000 > TimeOut
}

// 默认导出
export default service
