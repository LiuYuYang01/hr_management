// 该文件负责所有的公共的组件的全局注册   Vue.use
import pageTool from './pageTool'
import uploadExcel from './uploadExcel'

export default {
  install(Vue) {
    Vue.component('pageTool', pageTool)
    Vue.component('uploadExcel', uploadExcel)
  }
}
