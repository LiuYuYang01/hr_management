<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name" style="width: 80%" />
        </el-form-item>

        <el-form-item label="活动区域" prop="region">
          <el-select
            v-model="ruleForm.region"
            placeholder="请选择活动区域"
            style="width: 80%"
          >
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>

        <el-form-item label="活动形式" prop="desc">
          <el-input
            v-model="ruleForm.desc"
            type="textarea"
            style="width: 80%"
          />
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
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        region: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '123123123123', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    }
  }
}
</script>

<style>
.el-dialog__footer {
  padding: 10px 90px 20px;
}
</style>
