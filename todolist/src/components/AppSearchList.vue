<script lang="ts">
import { defineComponent } from 'vue'
import { useTodoStore } from '@/store'

export default defineComponent({
    name: 'AppSearchList',
    setup() {
        const todoStore = useTodoStore()
        return {
            todoStore
        }
    }
})
</script>

<template>
    <div v-if="todoStore.serach_focus">
        搜索中
    </div>
    <slot v-else />
</template>
