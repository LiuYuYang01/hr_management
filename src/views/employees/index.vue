<template>
  <div class="dashboard-container">
    <pageTool>
      <template v-slot:left>
        111
      </template>

      <template v-slot:right>
        <el-row>
          <el-button size="small" type="danger">普通Excel导出</el-button>
          <el-button size="small" type="info">复杂表头Excel导出</el-button>
          <el-button size="small" type="success">Excel导入</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </el-row>
      </template>
    </pageTool>
    <div class="app-container">
      <h2>
        员工
      </h2>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>
