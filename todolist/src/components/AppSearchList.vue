<script lang="ts">
import { defineComponent } from 'vue'
import { useTaskStore } from '@/store'

export default defineComponent({
    name: 'AppSearchList',
    setup() {
        const taskStore = useTaskStore()
        return { taskStore }
    }
})
</script>

<template>
    <div v-if="taskStore.serach_focus">
        搜索中
    </div>
    <slot v-else />
</template>
