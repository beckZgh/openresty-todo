<script setup lang="ts">
import { useTaskCateStore, useTaskStore } from '@/store'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import InputTask  from './components/InputTask.vue'
import TaskHeader from './components/TaskHeader.vue'
import TaskItem   from './components/TaskItem.vue'

import AppFormDialog    from '@/components/AppFormDialog.vue'

const taskCateStore = useTaskCateStore()
const taskStore     = useTaskStore()
const $route        = useRoute()

const form_dialog_ref = ref()
onMounted(() => {
    taskCateStore.setFormDialogRef(form_dialog_ref.value)
})

const list$  = computed(() => {
    const cate_id = $route.params.id as string
    switch(cate_id) {
        case 'myday'       : return taskStore.myday_list$
        case 'important'   : return taskStore.important_list$
        case 'closing_date': return taskStore.closing_date_list$
        case 'inbox'       : return taskStore.inbox_list$
        default            : return taskStore.cate_list$[cate_id] || []
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

    <AppFormDialog ref="form_dialog_ref" />
</template>
