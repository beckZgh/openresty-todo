<script setup lang="ts">
import { useTodoStore, useAppStore } from '@/store'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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
    <div>
        <ElButton @click="todoStore.addTask">添加</ElButton>
        <div>
            <div>未完成</div>
            <ul>
                <template v-for="item in unfinished$">
                    <li style="line-height: 2">{{ item.todo_name }}
                        <ElButton @click="todoStore.setTaskName(item)">修改</ElButton>
                        <ElButton @click="todoStore.delTask(item)">删除</ElButton>
                        <ElButton text @click="todoStore.setTaskIsFinished(item.todo_id, item.is_finished ? 0 : 1)">
                            {{ item.is_finished ? '已完成' : '未完成' }}
                        </ElButton>
                        <ElButton text @click="todoStore.setTaskImportant(item.todo_id, item.is_important ? 0 : 1)">
                            {{ item.is_important ? '重要' : '不重要' }}
                        </ElButton>
                        <ElButton text @click="todoStore.setTaskMyday(item.todo_id, appStore.today$)">
                            {{ item.myday > '1900-01-01' ? '我的一天' : '非我的一天' }}
                        </ElButton>

                        <el-popover placement="right" :width="400" trigger="click">
                            <template #reference>
                                <ElButton text >
                                    {{ item.closing_date > '1900-01-01' ? '计划内' : '非计划内' }}
                                </ElButton>
                            </template>
                            <ElButton @click="todoStore.setTaskClosingDate(item.todo_id, appStore.today$)">今天到期</ElButton>
                            <ElButton @click="todoStore.setTaskClosingDate(item.todo_id, appStore.tomorrow$)">明天到期</ElButton>
                            <ElButton @click="todoStore.setTaskClosingDate(item.todo_id, '1900-01-01')">取消截止日期</ElButton>
                        </el-popover>
                    </li>
                </template>
            </ul>

            <div>已完成</div>
            <ul>
                <template v-for="item in finished$">
                    <li style="line-height: 2">{{ item.todo_name }}
                        <ElButton @click="todoStore.setTaskName(item)">修改</ElButton>
                        <ElButton @click="todoStore.delTask(item)">删除</ElButton>
                        <ElButton text @click="todoStore.setTaskIsFinished(item.todo_id, item.is_finished ? 0 : 1)">
                            {{ item.is_finished ? '已完成' : '未完成' }}
                        </ElButton>
                        <ElButton text @click="todoStore.setTaskImportant(item.todo_id, item.is_important ? 0 : 1)">
                            {{ item.is_important ? '重要' : '不重要' }}
                        </ElButton>
                        <ElButton text @click="todoStore.setTaskMyday(item.todo_id, appStore.today$)">
                            {{ item.myday > '1900-01-01' ? '我的一天' : '非我的一天' }}
                        </ElButton>

                        <el-popover placement="right" :width="400" trigger="click">
                            <template #reference>
                                <ElButton text >
                                    {{ item.closing_date > '1900-01-01' ? '计划内' : '非计划内' }}
                                </ElButton>
                            </template>
                            <ElButton @click="todoStore.setTaskClosingDate(item.todo_id, appStore.today$)">今天到期</ElButton>
                            <ElButton @click="todoStore.setTaskClosingDate(item.todo_id, appStore.tomorrow$)">明天到期</ElButton>
                            <ElButton @click="todoStore.setTaskClosingDate(item.todo_id, '1900-01-01')">取消截止日期</ElButton>
                        </el-popover>
                    </li>
                </template>
            </ul>
        </div>
    </div>
</template>
