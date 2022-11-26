import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/store'

import Layout from '@/layout/index.vue'

// 创建路由
export const router = createRouter({
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
                // {
                //     path: 'myday',
                //     name: 'TasksMyday',
                //     component: () => import('@/views/tasks/myday.vue')
                // },
                // {
                //     path: 'important',
                //     name: 'TasksImportant',
                //     component: () => import('@/views/tasks/important.vue')
                // },
                // {
                //     path: 'planned',
                //     name: 'TasksPlanned',
                //     component: () => import('@/views/tasks/planned.vue')
                // },
                // {
                //     path: 'inbox',
                //     name: 'TasksInbox',
                //     component: () => import('@/views/tasks/inbox.vue')
                // },
                {
                    path: ':id',
                    name: 'TasksDynamicId',
                    component: () => import('@/views/tasks/list.vue')
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

// 白名单
const WHITE_NAMES = ['Login']

// 重置路由
export function resetRouter() {
    router.getRoutes().forEach((route) => {
        const name = route.name
        if (name && !WHITE_NAMES.includes(name as string)) {
            router.hasRoute(name) && router.removeRoute(name)
        }
    })
}

router.beforeEach((to) => {
    // 白名单跳过权限检查
    if (to.name && WHITE_NAMES.includes(to.name as string)) return true

    // 未登录
    const appStore = useAppStore()
    if ( !appStore.is_login$ ) return { name: 'Login', query: { redirect: to.fullPath } }

    return true
})

export default router
