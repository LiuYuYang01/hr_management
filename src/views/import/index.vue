<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success({ header, results }) {
      // 将导入的名称改成英文，不然接口会提交失败
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '聘用形式': '未知',
        '部门': 'departmentName'
      }

      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // 当前对象的键：key
          // 当前对象的值：item[key]
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })

      // 调用批量导入接口
      const { message, success } = await importEmployee(arr)
      // 消息提示
      if (success) {
        this.$message.success(message)
      } else {
        this.$message.error(message)
      }

      // 导入后退回到之前页面
      this.$router.back()
    }
  }
}
</script>

<style>
</style>
