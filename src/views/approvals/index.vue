<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <div>江苏传智播客教育科技股份有限公司</div>
        </el-col>
        <el-col :span="3" style="display: flex; justify-content: space-between">
          <span>负责人</span>
          <el-dropdown>
            <span class="el-dropdown-link">
              下拉菜单<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item disabled>双皮奶</el-dropdown-item>
              <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style></style>
