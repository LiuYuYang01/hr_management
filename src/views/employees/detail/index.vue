<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form ref="userInfo" :model="userInfo" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="userInfo.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            12312
          </el-tab-pane>
          <el-tab-pane label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      userId: this.$route.params.id,
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度限制为：6~9位数', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    const { data } = await getUserDetailById(this.userId)
    this.userInfo = { ...data, password: this.userInfo.password2 }
  },
  methods: {
    async saveUser() {
      try {
        await this.$refs.userInfo.validate()
        // 调用保存信息接口
        const { success, message } = await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
        if (success) this.$message.success(message)
        // 回退到员工列表
        this.$router.back()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
</style>
