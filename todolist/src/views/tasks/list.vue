<script setup lang="ts">
import { useTodoStore, useAppStore } from '@/store'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import InputTask  from './components/InputTask.vue'
import TaskHeader from './components/TaskHeader.vue'
import TaskItem   from './components/TaskItem.vue'

const appStore  = useAppStore()
const todoStore = useTodoStore()
const $route    = useRoute()

const list$  = computed(() => {
    const cate_id = $route.params.id as string
    switch(cate_id) {
        case 'myday'       : return todoStore.myday_list$
        case 'important'   : return todoStore.important_list$
        case 'closing_date': return todoStore.closing_date_list$
        case 'inbox'       : return todoStore.inbox_list$
        default            : return todoStore.cate_list$[cate_id] || []
    }
})

const unfinished$ = computed(() => list$.value.filter(item => item.is_finished === 0))
const finished$   = computed(() => list$.value.filter(item => item.is_finished === 1))
</script>

<template>
    <div class="task-container">
        <TaskHeader />
        <div class="task-container-body">
           <ElScrollbar height="100%">
                <template v-for="item in unfinished$" :key="item.todo_id">
                   <TaskItem :item="item" />
                </template>
           </ElScrollbar>
        </div>

        <div class="task-container-footer">
            <InputTask />
        </div>
    </div>
</template>
