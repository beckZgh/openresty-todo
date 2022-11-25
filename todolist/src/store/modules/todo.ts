
import { defineStore } from 'pinia'
import { reactive, toRefs, computed } from 'vue'
import { useAppStore } from './app'

export const useTodoStore = defineStore('todo', () => {
    // 数据
    const state = reactive({
        list    : [] as $api.$dd_todo[],
        loaded  : false,
    })

    // --- computed -------------------
    const appStore = useAppStore()

    // 我的一天
    const myday$ = computed(() => {
        return []
    })


    // 加载数据
    async function load(refresh = false) {
        if (state.loaded) return

        const res = await $api.dd.todo.list({}, { showLoading: true, delay: refresh ? 0 : 300 })
        if (res) {
            state.list   = res.data
            state.loaded = true
        }
    }

    // 刷新数据
    async function refresh() {
        return await load(true)
    }

    return {
        ...toRefs(state),
        load,
        refresh
    }
})
