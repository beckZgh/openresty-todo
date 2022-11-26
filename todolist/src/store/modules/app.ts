
import { reactive, toRefs, computed } from 'vue'
import { defineStore } from 'pinia'
import { router      } from '@/router'

export const useAppStore = defineStore('app', () => {
    const G = window.G || {}

    // 数据
    const state = reactive({
        server_time: G.server_time ?? 0,
        server_date: G.server_date ?? '',
        user       : G.user ?? null as $api.$pv_user | null,
    })

    // 今天
    const today$ = computed(() => state.server_date || $utils.dt.format(new Date()))

    // 明天
    const tomorrow$ = computed(() => $utils.dt.nextDate(today$.value))

    // 是否已登录
    const is_login$ = computed(() => !!state.user?.user_id )

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
        if ( !res.ok ) return

        state.user = res.data.user
        router.replace(redirect_url ? redirect_url : '/')
        $utils.successNotice('登录成功')
    }

    // 退出
    async function logout() {
        if (!router) return

        // 清除 cookie
        const res = await $api.pv.logout({}, { showLoading: true })
        if ( !res.ok ) return

        router.replace({
            path : '/login',
            query: { redirect: router.currentRoute.value.fullPath }
        })
        $utils.successNotice('退出登录成功')
    }

    // 更新时间
    function setServerTime(data: { server_time: number; server_date: string }) {
        state.server_time = data.server_time
        state.server_date = data.server_date
    }

    return {
        ...toRefs(state),
        is_login$,
        today$,
        tomorrow$,
        register,
        login,
        logout,
        setServerTime
    }
})
