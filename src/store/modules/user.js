import { loginAPI } from '@/api/user'
import { setToken, getToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    // 从Cookies中拿到token
    token: getToken()
  },
  mutations: {
    loginMutations(state, token) {
      state.token = token
      // 将token持久化存储到Cookies
      setToken(token)
    }
  },
  actions: {
    async loginActions({ commit }, payload) {
      try {
        // 加载状态
        payload.that.loading = true

        const res = await loginAPI(payload.loginForm)
        console.log(res, '登录')
        commit('loginMutations', res.data)

        payload.that.$message({
          message: '恭喜你，登录成功！',
          type: 'success'
        })
      } catch (err) {
        payload.that.$message.error(err)
      } finally {
        // 不论执行try 还是catch  都会停止加载状态
        payload.that.loading = false
      }
    }
  }
}
