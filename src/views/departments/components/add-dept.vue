<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="visible" @click="close">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>

      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          value=""
          @focus="headOfDepartment"
        >
          <el-option
            v-for="item in employee"
            :key="item.id"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, getEmployeeSimple, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 校验部门是否存在
    const checkNameRepeat = async(rule, value, callback) => {
      const {
        data: { depts }
      } = await getDepartments()

      let isRepeat = false

      // 有id就代表编辑部门，没有就代表添加部门
      if (this.formData.id) {
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 获取指定部门下面的所有部门
        const department = depts.filter((item) => item.pid === this.treeNode.id)

        // 查找指定部门中有没有准备添加的部门
        isRepeat = department.some((item) => item.name === value)
      }

      // 如果存在就提示已存在，否则放行
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }

    // 校验部门编码是否存在
    const checkCodeRepeat = async(rule, value, callback) => {
      const {
        data: { depts }
      } = await getDepartments()

      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        isRepeat = depts.filter((item) => item.pid === this.treeNode.id).some((item) => item.code === value && value)
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }

    return {
      // 定义表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1~50个字符',
            trigger: 'blur'
          },
          {
            validator: checkNameRepeat, // 自定义函数的形式校验
            trigger: 'blur'
          }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1~50个字符',
            trigger: 'blur'
          },
          {
            validator: checkCodeRepeat,
            trigger: 'blur'
          }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur',
            min: 1,
            max: 300,
            message: '部门介绍要求1-50个字符'
          }
        ]
      },
      employee: []
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async headOfDepartment() {
      const res = await getEmployeeSimple()
      this.employee = res.data
      console.log(this.employee)
    },
    // 确定
    btnOk() {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            // 新增部门
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }

          // 重新渲染最新数据
          this.$emit('addDepts')

          // 修改数据语法糖：(update:props名称, 值)
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 关闭
    close() {
      // 重置表单数据 上一次输入的内容需要清空
      this.$refs.deptForm.resetFields()
      // 关闭弹框
      this.$emit('update:showDialog', false)
    },
    // 调用编辑接口
    async getDepartDetail(id) {
      // 有id证明是编辑  无id证明是添加
      const { data } = await getDepartDetail(id)
      this.formData = data
      console.log(this.formData)
    }
  }
}
</script>

<style></style>
