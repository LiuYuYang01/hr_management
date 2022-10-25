<template>
  <div class="dashboard-container">
    <pageTool>
      <template v-slot:left>
        <el-alert :closable="false" title="共16条记录" type="info" show-icon style="width:140px" />
      </template>

      <template v-slot:right>
        <el-row>
          <el-button size="small" type="success" @click="$router.push('/import')">Excel 导入</el-button>
          <el-button size="small" type="danger" @click="exportEmp">Excel 导出</el-button>
          <el-button size="small" type="primary" @click="newEmployees">新增员工</el-button>
        </el-row>
      </template>
    </pageTool>

    <!-- 放置表格和分页 -->
    <el-card v-loading="loading">
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" width="100" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="">
          <!-- 作用域插槽 -->
          <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
        </el-table-column>
        <el-table-column label="账户状态" sortable="" prop="enableState" />
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination layout="prev, pager, next" :page-size="page.size" :current-page="page.page" :total="page.total" @current-change="changePage" />
      </el-row>
    </el-card>

    <addEmployee :show-dialog.sync="showDialog" />
  </div>
</template>

<script>
// 格式化招聘形式
import EmployeeEnum from '@/constant/employees'
// 格式化时间
import { getEmployeeList, delEmployee } from '@/api/employees'
import addEmployee from './component/addEmployee'
import { formatDate } from '@/filters/index'
export default {
  components: { addEmployee },
  data() {
    return {
      list: [],
      loading: false,
      page: {
        page: 1, // 第几页
        size: 10, // 每页显示10个
        total: 0 // 总数量
      },
      showDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工数据
    async getEmployeeList() {
      this.loading = true

      const {
        data: { rows, total }
      } = await getEmployeeList(this.page)
      console.log(rows)

      this.list = rows
      this.page.total = total

      this.loading = false
    },
    // 获取最新页数
    async changePage(page) {
      this.page.page = page
      // 重新调用拿到最新数据
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 当前值：cellValue

      // hireType: [
      //   {
      //     id: 1,
      //     value: '正式'
      //   },
      //   {
      //     id: 2,
      //     value: '非正式'
      //   }
      // ],
      // 通过EmployeeEnum.hireType的id判断证书 or 非正式
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    delEmployee(id) {
      try {
        this.$confirm('你确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            await delEmployee(id)
            this.getEmployeeList()

            return this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: error
            })
          })
      } catch (error) {
        this.$message.error(error)
      }
    },
    // 新增员工
    newEmployees() {
      this.showDialog = true
    },
    // 导出员工
    async exportEmp() {
      // 表头
      const headers = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        聘用形式: 'formatEmployment',
        部门: 'departmentName'
      }

      const {
        data: { rows }
      } = await getEmployeeList({ page: 1, size: this.page.total })
      const data = this.formatJson(headers, rows)

      import('@/vendor/Export2Excel').then((excel) => {
        // const multiHeader = [['入职日期', '其他', '', '', '', '', '部门']]
        // const merges = ['A1:A2', 'B1:F1', 'G1:G2']

        excel.export_json_to_excel({
          // 导出数据的表头
          header: Object.keys(headers),
          // 导出的具体数据
          data,
          // 导出的文件名
          filename: '员工列表',
          // 单元格自适应宽度
          autoWidth: true,
          // 导出文件类型
          bookType: 'xlsx'
          // multiHeader, merges
        })
      })
    },
    // 将对象转换为二维数组
    formatJson(headers, rows) {
      return rows.map((item) => {
        // 获取所有键名
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formatEmployment') {
            const en = EmployeeEnum.hireType.find(
              (item) => item.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          }

          return item[headers[key]]
        })
      })
    }
  }
}
</script>

<style>
</style>
