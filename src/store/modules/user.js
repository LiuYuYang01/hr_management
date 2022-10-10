import { loginAPI, getUserInfoAPI, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
import { setTimeStamp } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    // 从Cookies中拿到token
    token: getToken(),
    // 用户信息
    userInfo: {}
  },
  mutations: {
    // 登录
    loginMutations(state, token) {
      state.token = token
      // 将token持久化存储到Cookies
      setToken(token)
    },
    // 更新用户信息
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    // 清除用户信息
    removeUserInfo(state, payload) {
      state.userInfo = {}
    },
    // 清除token
    removeToken(state, payload) {
      state.token = ''
    }
  },
  actions: {
    // 登录
    async loginActions({ commit }, payload) {
      try {
        // 加载状态
        payload.that.loading = true

        const res = await loginAPI(payload.loginForm)

        commit('loginMutations', res.data)

        payload.that.$message({
          message: '恭喜你，登录成功！',
          type: 'success'
        })

        // 写入时间戳
        setTimeStamp() // 将当前的最新时间写入缓存
      } catch (err) {
        payload.that.$message.error(err)
      } finally {
        // 不论执行try 还是catch  都会停止加载状态
        payload.that.loading = false
      }
    },
    // 获取用户信息
    async getUserInfo({ commit }) {
      // 用户信息
      const { data: res } = await getUserInfoAPI()
      // 用户头像
      const baseInfo = await getUserDetailById(res.userId)
      // 合并信息
      commit('setUserInfo', { ...res, ...baseInfo.data })
    },
    // 退出登录
    async logout({ commit }) {
      // 清除用户信息
      commit('removeUserInfo')
      // 清除token
      commit('removeToken')
      // 清除Cookie
      removeToken()
    }
  }
}
