import axios from 'axios'
// 创建实例
const service = axios.create({})
// 请求拦截
service.interceptors.request.use()
// 响应拦截
service.interceptors.response.use()
// 默认导出
export default service
