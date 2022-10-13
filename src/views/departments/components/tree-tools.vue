<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span><b>{{ treeNode.name }}</b></span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="opterDepts">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="emit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
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
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    opterDepts(type) {
      console.log(type)
      // 添加
      if (type === 'add') {
        this.$emit('addDepartments', this.treeNode)
      }
      // 编辑
      else if (type === 'emit') {
      } // 删除
      else if (type === 'del') {
        this.$confirm('确定要删除吗？')
          .then(() => {
            return delDepartments(this.treeNode.id)
          })
          .then((res) => {
            console.log(res)
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          })
          .catch((res) => {
            this.$message.error(res)
          })
      }
    }
  }
}
</script>

<style></style>
