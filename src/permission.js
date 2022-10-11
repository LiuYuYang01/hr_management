import router from './router'
import store from '@/store'
// 进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach(async(to, form, next) => {
  // 页面切换前 开启进度条
  nprogress.start()

  const token = store.getters.token
  const writeList = ['/login', '/404'] // 白名单

  // 如果有token就证明登录成功
  if (token) {
    // 登录成功后不允许再访问login页面，其他页面均可访问
    if (to.path === '/login') {
      next('/')
    } else {
      // 没有用户信息就获取，用户信息了就没有必要再获取一遍
      if (!store.getters.userId) {
        // 没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
        // 这里写await 是因为需要获取完资料再next放行
      }
      next()
    }
  } else {
    // 如果没有token就证明登录失败，然后限制只能访问login与404页面

    // 未登录状态只能访问白名单内的路由
    // 查询访问的路由是否在白名单内
    // if (writeList.indexOf(to.path) > -1) {
    if (writeList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }

  // 页面切换完成后 关闭进度条
  nprogress.done()
})
