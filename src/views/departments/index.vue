<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <treeTools :tree-node="company" :is-root="true" />

        <!-- Tree 树形控件 -->
        <!-- 默认是否展开：default-expand-all -->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <treeTools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepartments="addDepartments"
          />
        </el-tree>
      </el-card>

      <addDept title="新增部门" :visible="showDialog" />
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
      company: {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人'
      },
      defaultProps: {
        // 指定二级分类名称
        children: 'children',
        // 指定一级分类名称
        label: 'name'
      },
      departs: [],
      showDialog: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      // this.departs = res.data.depts
      this.departs = tranListToTreeData(res.data.depts, '')
      console.log(res)
    },
    addDepartments(data) {
      this.showDialog = true
      console.log(data)
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
