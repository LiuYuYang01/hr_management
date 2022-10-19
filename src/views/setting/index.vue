<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName" v-loading="loading">
        <el-tab-pane label="角色管理" name="first">
          <!-- 新增角色按钮 -->
          <el-button type="primary" icon="el-icon-plus" size="small" style="margin: 40px 0px 25px" @click="showDialog = true">新增角色</el-button>

          <!-- 角色信息表格 -->
          <el-table :data="list" border style="width: 100%">
            <el-table-column type="index" label="序号" width="180" />
            <el-table-column prop="name" label="角色名" width="180" />
            <el-table-column prop="description" label="描述" />

            <el-table-column label="操作">
              <template slot-scope="{ row }">
                <el-button size="mini" type="success">分配权限</el-button>
                <el-button size="mini" type="primary" @click="updateRole(row.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteRole(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-row type="flex" justify="end" style="margin-top: 30px">
            <el-pagination :page-size="page.pagesize" :current-page="page.page" layout="prev, pager, next" :total="page.total" @current-change="pageCurrentChange" />
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="公司信息" name="second">
          <el-form :label-position="firm" label-width="80px" :model="firmInfo" style="width: 500px; margin: 50px 0 0 180px">
            <el-form-item label="企业名称">
              <el-input v-model="firmInfo.name" disabled />
            </el-form-item>

            <el-form-item label="公司地址">
              <el-input v-model="firmInfo.companyAddress" disabled />
            </el-form-item>

            <el-form-item label="公司电话">
              <el-input v-model="firmInfo.companyPhone" disabled />
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="firmInfo.mailbox" disabled />
            </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="firmInfo.remarks" type="textarea" disabled />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <el-dialog title="编辑弹层" :visible="showDialog">
        <el-form ref="roleForm" :model="roleForm" label-width="120px">
          <el-form-item label="角色名称">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole
} from '@/api/setting'
export default {
  data() {
    return {
      activeName: 'first',
      loading: false,
      page: {
        page: 1, // 第几页
        pagesize: 5, // 每页显示几个数据
        total: 0 // 用来记录总数
      },
      list: [],
      firm: 'right',
      firmInfo: {
        name: '江苏传智播客教育科技股份有限公司',
        address: '北京市昌平区建材城西路金燕龙办公楼一层',
        phone: '400-618-9090',
        mailbox: 'bd@itcastcn',
        remark: '传智播客官网-好口碑IT培训机构,一样的教育,不一样的品质'
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: [{}]
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    // 获取角色列表
    this.getRoleList()
    // 获取公司信息
    this.getCompanyInfo()
  },
  methods: {
    // 获取角色列表数据
    async getRoleList() {
      this.loading = true

      const {
        data: { rows, total }
      } = await getRoleList(this.page)
      this.list = rows // 角色数据
      this.page.total = total // 总数
      this.loading = false
      console.log(rows)
    },
    // 获取点击的哪一页
    pageCurrentChange(newPage) {
      // 点击哪个就获得最新的页数
      this.page.page = newPage
      // 重新调用获取最新的角色数据
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo() {
      const { data } = await getCompanyInfo(this.companyId)
      this.firmInfo = data
    },
    // 删除角色
    async deleteRole(id) {
      try {
        const res = await deleteRole(id)
        // 删除成功提示
        this.$message.success(res.message)
        // 重新调用获取最新角色数据
        this.getRoleList()
      } catch (error) {
        // 删除失败提示
        this.$message.error(error)
      }
    },
    // 关闭弹框
    btnCancel() {
      // 清空数据
      this.roleForm = {
        name: '',
        description: ''
      }

      this.showDialog = false
    },
    // 确定按钮
    async btnOK() {
      try {
        if (this.roleForm.id) {
          // 修改
          const { message } = await updateRole(this.roleForm)
          if (message) this.$message.success(message)
        } else {
          // 新增
          const { message } = await addRole(this.roleForm)
          if (message) this.$message.success(message)
        }

        // 重新获取最新数据
        this.getRoleList()
        // 关闭弹框
        this.showDialog = false
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 编辑角色
    async updateRole(id) {
      // 弹出框
      this.showDialog = true
      // 回显数据
      const { data } = await getRoleDetail(id)
      this.roleForm = data
    }
  }
}
</script>

<style></style>
