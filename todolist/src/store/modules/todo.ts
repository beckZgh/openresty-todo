
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

export const useTodoStore = defineStore('todo', () => {
    // 数据
    const state = reactive({
       list: []
    })

    // 加载数据
    async function load() {

    }

    return {
        ...toRefs(state),
        load
    }
})
