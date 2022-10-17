<template>
  <div class="dashboard-container">
    <div class="app-container">
      <tree-tools :tree-node="com" />

      <el-tree :data="depts" :props="defaultProps">
        <tree-tools
          slot-scope="{ data }"
          :isaaa="true"
          :tree-node="data"
          @remove="getDepartments"
        />
      </el-tree>

      <add-dept :dialog-visible="true" />
    </div>
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils/index'
import { getDepartments, addDepartments } from '@/api/departments'
import treeTools from '@/views/attendances/component/tree-tools.vue'
import addDept from '@/views/attendances/component/add-dept.vue'
export default {
  components: { treeTools, addDept },
  data() {
    return {
      depts: [],
      com: {
        name: '江苏省传智播客教育科技股份有限公司',
        manager: '负责人'
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const {
        data: { depts }
      } = await getDepartments()

      this.depts = tranListToTreeData(depts, '')
      console.log(this.depts)
    }
  }
}
</script>

<style>
.app-container {
  padding: 50px 200px;
}
</style>
