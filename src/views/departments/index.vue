<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <treeTools :tree-node="company" :is-root="true" @addDepartments="addDepartments" />

        <!-- Tree 树形控件 -->
        <!-- 默认是否展开：:default-expand-all="true"  为true默认展开 反之默认收起 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <treeTools slot-scope="{ data }" :tree-node="data" @delDepts="getDepartments" @addDepartments="addDepartments" @update="updateDepartments" />
        </el-tree>
      </el-card>

      <addDept ref="updateTools" title="新增部门" :visible="showDialog" :tree-node="treeNode" :show-dialog.sync="showDialog" @addDepts="getDepartments" />
    </div>
  </div>
</template>

<script>
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import addDept from './components/add-dept.vue'
export default {
  components: { treeTools, addDept },
  data() {
    return {
      loading: false,
      company: {},
      defaultProps: {
        // 指定二级分类名称
        children: 'children',
        // 指定一级分类名称
        label: 'name'
      },
      departs: [],
      showDialog: false,
      treeNode: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    // 获取部门数据
    async getDepartments() {
      this.loading = true

      const {
        data: { depts }
      } = await getDepartments()
      this.departs = tranListToTreeData(depts, '')
      this.company = {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人',
        id: ''
      }

      this.loading = false
      console.log(depts)
    },
    // 添加部门
    addDepartments(data) {
      this.showDialog = true
      this.treeNode = data
    },
    // 修改部门
    updateDepartments(data) {
      this.showDialog = true
      this.$refs.updateTools.getDepartDetail(data.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
