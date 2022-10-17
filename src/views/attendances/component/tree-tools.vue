<template>
  <el-row type="flex" justify="space-between" style="width: 100%">
    <el-col :span="12">{{ treeNode.name }}</el-col>

    <el-col :span="3" style="display: flex; justify-content: space-between">
      <span>{{ treeNode.manager }}</span>
      <span>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            操作<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">添加</el-dropdown-item>
            <el-dropdown-item v-if="isaaa" command="update">修改</el-dropdown-item>
            <el-dropdown-item v-if="isaaa" command="del" divided>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isaaa: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(type) {
      if (type === 'add') {

      } else if (type === 'update') {

      } else if (type === 'del') {
        this.$confirm('确定删除？').then(res => {
          delDepartments(this.treeNode.id)
        }).then(res => {
          this.$emit('remove')
          this.$message.success('删除部门成功')
        }).catch(res => {
          this.$message.error('删除部门失败')
        })
      }
    }
  }
}
</script>

<style></style>
