import axios from 'axios'

// 创建axios实例对象
const service = axios.create({})

// 创建请求拦截
service.interceptors.request.use()

// 创建响应拦截
service.interceptors.response.use()

// 导出axios实例
export default service
