<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-dialog
        title="添加部门"
        :visible="true"
        width="30%"
        :before-close="handleClose"
      >
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="活动名称">
            <el-input v-model="form.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="form.region" placeholder="请选择活动区域" style="width:90%">
              <el-option label="区域一" value="shanghai" />
              <el-option label="区域二" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动形式">
            <el-input v-model="form.desc" type="textarea" style="width:90%" />
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogVisible = false"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((res) => {
          done()
          console.log(res)
        })
        .catch((res) => {
          console.log(res)
        })
    }
  }
}
</script>

<style>
.el-dialog__body{
  padding-bottom: 0 !important;
}
</style>
