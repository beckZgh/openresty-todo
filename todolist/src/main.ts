import 'normalize.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css' // 暗黑主题
import './styles/index.scss'

import './utils'
import './apis'

import { createApp, h } from 'vue'
import ElementPslus     from 'element-plus'
import DayjsZhCn        from 'dayjs/locale/zh-cn'
import Store            from '@/store'
import Router           from '@/router'
import * as EpIcons     from '@element-plus/icons-vue'
import App              from './App.vue'

const app = createApp(App)

// 注册所有图标组件
for (const [key, component] of Object.entries(EpIcons)) {
    app.component(key, component)
}

app.use(Store)
app.use(Router)
app.use(ElementPslus, { locale: DayjsZhCn })
app.mount('#app')
