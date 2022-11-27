
import { reactive, toRefs, computed, watch } from 'vue'
import { defineStore  } from 'pinia'
import { router       } from '@/router'
import { useTodoStore } from './todo'

export const useAppStore = defineStore('app', () => {
    const G    = window.G || {}
    const navs: IntelligenceNavItem[] = [
        {
            id: 'myday', title: '我的一天', path: '/tasks/myday', icon: 'Sunny',
            dark_theme : { type: 'image', value: '@/assets/img0.jpg' },
            light_theme: { type: 'image', value: '@/assets/img0.jpg' }
        },
        {
            id: 'important', title: '重要', path: '/tasks/important', icon: 'Star',
            dark_theme : { type: 'image', value: '@/assets/img0.jpg' },
            light_theme: { type: 'image', value: '@/assets/img0.jpg' }
        },
        {
            id: 'closing_date', title: '计划内', path: '/tasks/closing_date', icon: 'Calendar',
            dark_theme : { type: 'image', value: '@/assets/img0.jpg' },
            light_theme: { type: 'image', value: '@/assets/img0.jpg' }
        },
        {
            id: 'inbox', title: '任务', path: '/tasks/inbox', icon: 'House',
            dark_theme : { type: 'image', value: '@/assets/img0.jpg' },
            light_theme: { type: 'image', value: '@/assets/img0.jpg' }
        },
    ]

    // 数据
    const state = reactive({
        server_time: G.server_time ?? 0,
        server_date: G.server_date ?? '',
        user       : G.user ?? null as $api.$pv_user | null,
        navs       ,
        curr_nav   : navs[0] as IntelligenceNavItem | $api.$dd_todo_cate,
        setting    : {
            theme: 'light' as 'dark' | 'light',
            enable_important    : true ,
            enable_closing_date : true ,
            enable_finished     : false,
            enable_all          : false,
            ...loadAppSetting()
        }
    })

    // 智能列表导航
    const navs$ = computed(() => {
        return navs.map(item => {
            const is_enable = state.setting[`enable_${ item.id }`]
            return { ...item, show: is_enable === undefined || is_enable === true }
        })
    })

    // 今天
    const today$ = computed(() => state.server_date || $utils.dt.format(new Date()))

    // 明天
    const tomorrow$ = computed(() => $utils.dt.nextDate(today$.value))

    // 是否已登录
    const is_login$ = computed(() => !!state.user?.user_id )

    // 缓存配置
    watch(() => state.setting, (setting) => {
        switchTheme()
        saveAppSetting(setting)
    }, { deep: true })

    // 注册
    async function register(req: { mobile: string; password: string }) {
        const res = await $api.pv.register(req)
        if (res.ok) {
            $utils.successNotice('注册成功')
        }
        return res
    }

    // 登录
    async function login(req: { mobile: string; password: string }, redirect_url?: string) {
        const res = await $api.pv.login(req)
        if (res.ok) {
            state.user = res.data.user
            router.replace(redirect_url ? redirect_url : '/')
            $utils.successNotice('登录成功')
        }
        return res
    }

    // 退出
    async function logout() {
        if (!router) return

        // 清除 cookie
        const res = await $api.pv.logout({}, { showLoading: true })
        if ( !res.ok ) return

        // 清空待办任务
        useTodoStore().clear()

        router.replace({
            path : '/login',
            query: { redirect: router.currentRoute.value.fullPath }
        })
        $utils.successNotice('退出登录成功')
    }

    // 更新日期和时间
    function updateDateWithTime(data: { server_time: number; server_date: string }) {
        state.server_time = data.server_time
        state.server_date = data.server_date
    }

    // 设置主题
    function switchTheme() {
        const html = document.querySelector('html')
        if ( !html ) return

        if (state.setting.theme === 'dark') {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    }

    return {
        ...toRefs(state),
        navs$,
        is_login$,
        today$,
        tomorrow$,
        register,
        login,
        logout,
        initTheme: switchTheme,
        updateDateWithTime
    }
})

function loadAppSetting() {
    try {
        return JSON.parse(localStorage.getItem('app-setting') as string)
    } catch (error) {}
}

function saveAppSetting(setting: any) {
    localStorage.setItem('app-setting', JSON.stringify(setting))
}
