import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'

// 创建路由
const router = createRouter({
    history       : createWebHistory(),
    routes        : [
        {
            path    : '/',
            name    : 'Root',
            redirect: '/tasks',
        },
        {
            path: '/tasks',
            name: 'Tasks',
            redirect: '/tasks/myday',
            component: Layout,
            children: [
                {
                    path: 'myday',
                    name: 'TasksMyday',
                    component: () => import('@/views/tasks/myday.vue')
                },
                {
                    path: 'important',
                    name: 'TasksImportant',
                    component: () => import('@/views/tasks/important.vue')
                },
                {
                    path: 'planned',
                    name: 'TasksPlanned',
                    component: () => import('@/views/tasks/planned.vue')
                },
                {
                    path: 'inbox',
                    name: 'TasksInbox',
                    component: () => import('@/views/tasks/inbox.vue')
                }
            ]
        },
        {
            path     : '/login',
            name     : 'Login',
            component: () => import('@/views/login/index.vue')
        },
    ],
    strict        : true,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router

// // 获取路由基础路径
// function getUriBase() {
//     // 生产环境：默认读取后端配置
//     if (process.env.NODE_ENV === 'production' && window.G.uri_base) {
//         return window.G.uri_base
//     } else {
//         return import.meta.env.VITE_URI_BASE as string
//     }
// }
