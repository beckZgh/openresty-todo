import 'normalize.css'
import 'element-plus/dist/index.css'
import './styles/index.scss'

import './utils'
import './apis'

import { createApp, h } from 'vue'
import { RouterView   } from 'vue-router'
import ElementPslus     from 'element-plus'
import DayjsZhCn        from 'dayjs/locale/zh-cn'
import Store            from '@/store'
import Router           from '@/router'

const app = createApp({
    name: 'App',
    render: () => h(RouterView)
})

app.use(Store)
app.use(Router)
app.use(ElementPslus, { locale: DayjsZhCn })
app.mount('#app')
