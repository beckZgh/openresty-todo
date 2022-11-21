
import { defineStore      } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useAppStore = defineStore('app', () => {
    // 数据
    const state = reactive({
        server_time: 0,
        server_date: '',
        user: null as $api.$pv_user | null,
    })

    // 注册
    function register() {

    }

    // 登录
    function login() {

    }

    // 退出
    function logout() {

    }

    // 更新时间
    function setServerTime(data: { server_time: number; server_date: string }) {
        state.server_time = data.server_time
        state.server_date = data.server_date
    }

    return {
        ...toRefs(state),
        register,
        login,
        logout,
        setServerTime
    }
})
