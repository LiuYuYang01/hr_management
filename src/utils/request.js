import axios from 'axios'
// import store from '@/store'

// 创建axios实例对象
const service = axios.create({
  // 接口请求前缀
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置超时时间
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use()

// 响应拦截
service.interceptors.response.use(res => {
  // success为true代表登录成功，反之失败
  const { success, message } = res.data

  if (success) {
    return res.data
  } else {
    // 如果登录失败就返回失败信息
    return Promise.reject(message)
  }
})

// 默认导出
export default service
