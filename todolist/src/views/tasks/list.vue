<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed, ref, reactive, onMounted } from 'vue'
import { useAppStore, useTaskCateStore, useTaskStore } from '@/store'

import TaskHeader from './components/TaskHeader.vue'

const appStore      = useAppStore()
const taskStore     = useTaskStore()
const taskCateStore = useTaskCateStore()
const $router       = useRouter()

const contextmenu_ref = ref()
const m = reactive({
    input_task: '', // 录入的任务
})

// 所有列表
const task_cates$ = computed(() => {
    return taskCateStore.task_cates.filter(item => item.task_cate_type === 1)
})

// 当前路由列表
const list$ = computed((): { title?: string; opened: boolean; tasks: $api.$dd_task[] }[] => {
    const cate_id    = $router.currentRoute.value.params.id as string
    const tasks      = taskStore.task$[cate_id] || [] // 当前模式下的所有任务

    // 计划内
    if (cate_id === 'closing_date') {
        const beore_tasks           = [] // 先前
        const today_tasks           = [] // 今天
        const tomorrow_tasks        = [] // 明天
        const afetr_five_days_tasks = [] // 后天 ~ 下周
        const next_week_tasks       = [] // 下周
        const after_asks            = [] // 稍后

        tasks.forEach(item => {
            if (item.myday < appStore.today$) {
                if (item.is_finished === 0) beore_tasks.push(item)
            } else if (item.myday === appStore.today$) {
                today_tasks.push(item)
            } else if (item.myday === appStore.tomorrow$) {
                tomorrow_tasks.push(item)
            } else if (item.myday) {}
        })

        return []
    }

    // 区分未完成、已完成
    const unfinished = [] as $api.$dd_task[]
    const finished   = [] as $api.$dd_task[]
    tasks.forEach(item => {
        if (item.is_finished === 1) {
            finished.push(item)
        }  else {
            unfinished.push(item)
        }
    })

    // 重要：仅展示未完成
    if (cate_id === 'important') {
        return [{ tasks: unfinished, opened: false }]
    }

    // 其他默认展示：未完成、已完成
    return [
        { tasks: unfinished, opened: false,                },
        { title: '已完成'  , opened: false, tasks: finished },
    ]
})

// 当前编辑项
const curr_item$ = computed(() => taskStore.curr_edit_item)

onMounted(() => {
    taskStore.setContextmenuRef(contextmenu_ref.value)
})

// 添加任务
async function handleInputTaskEnter() {
    const input_task = m.input_task.trim()
    if ( !input_task ) return

    const res = await taskStore.addTask(input_task)
    if (res.ok) m.input_task = ''
}

// 格式化归属列表
function formatCateName(task: $api.$dd_task) {
    if (task.task_cate_id) {

    } else {
        return '任务'
    }
}

// 格式化截止日期
function formatClosingDate(date: string) {
    if (!date || date <= '1900-01-01') return ''

    if (date === appStore.today$   ) return '今天'
    if (date === appStore.tomorrow$) return '明天'

    return $utils.dt.format(date, 'MM月DD日,周d')
}
</script>

<template>
    <div class="task-container">
        <TaskHeader :cates="task_cates$" />
        <div class="task-container-body">
            <ElScrollbar height="100%">
                <template v-for="(item, _idx) in list$" :key="_idx">
                    <template v-if="item.tasks.length">
                        <div class="tasks-title" v-if="item.title">
                            <ElIcon><ArrowRight/></ElIcon>
                            <span>{{ item.title }} ({{ item.tasks.length }})</span>
                        </div>
                        <div class="tasks-wrap" :class="{ 'is-opened': item.opened }">
                            <template v-for="task in item.tasks" :key="task.task_id">
                                <div
                                    class="task-item"
                                    :class="{ 'is-finished': task.is_finished }"
                                    v-contextmenu:contextmenu_ref
                                    @contextmenu.prevent="taskStore.setCurrEditItem(task)"
                                >

                                    <div
                                        class="check-wrap"
                                        :class="{ 'is-finished': task.is_finished }"
                                        @click="taskStore.setTaskIsFinished(task)"
                                    >
                                        <ElIcon :size="10"><Check /></ElIcon>
                                    </div>

                                    <div class="task-item-inner">
                                        <div class="task-item-inner-top">
                                            <span class="task-item-inner-top__name">{{ task.task_name }}</span>
                                            <ElIcon :size="20" style="cursor: pointer;" @click="taskStore.setTaskImportant(task)">
                                                <component :is="task.is_important === 1 ? 'StarFilled' : 'Star'" />
                                            </ElIcon>
                                        </div>
                                        <div class="task-item-inner-bottom">
                                            <span>{{ formatCateName(task) }}</span>
                                            <span>{{ formatClosingDate(task.closing_date) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </template>
                </template>
            </ElScrollbar>

        </div>

        <div class="task-container-footer">
            <ElInput
                v-model="m.input_task"
                class="input-task"
                prefix-icon="Plus"
                size="large"
                placeholder="添加任务"
                @keyup.stop.enter="handleInputTaskEnter"
            />
        </div>
    </div>

    <!-- 自定义列表右键菜单 -->
    <VContextmenu ref="contextmenu_ref" >
        <div v-if="curr_item$" style="width: 190px">
            <VContextmenuItem @click="taskStore.setTaskMyday(curr_item$!)">
                <ElIcon><Sunny/></ElIcon>
                {{ curr_item$.myday !== '1900-01-01' ? '从 “我的一天” 中删除' : '添加到 “我的一天”' }}
            </VContextmenuItem>
            <VContextmenuItem @click="taskStore.setTaskImportant(curr_item$!)">
                <ElIcon><Star/></ElIcon>
                {{ curr_item$.is_important === 1 ? '删除重要标记' : '标记为重要' }}
            </VContextmenuItem>
            <VContextmenuItem @click="taskStore.setTaskIsFinished(curr_item$!)">
                <ElIcon><CircleCheck/></ElIcon>
                {{ curr_item$.is_finished === 1 ? '标记为未完成' : '标记为已完成' }}
            </VContextmenuItem>
            <VContextmenuDivider/>
            <VContextmenuItem @click="taskStore.setTaskClosingDate(curr_item$!, 'today')">
                <ElIcon><Calendar/></ElIcon>
                今天到期
            </VContextmenuItem>
            <VContextmenuItem @click="taskStore.setTaskClosingDate(curr_item$!, 'tomorrow')">
                <ElIcon><Calendar/></ElIcon>
                明天到期
            </VContextmenuItem>
            <VContextmenuItem >
                <ElIcon><Calendar/></ElIcon>
                选择日期
            </VContextmenuItem>
            <VContextmenuItem v-if="curr_item$.closing_date" @click="taskStore.setTaskClosingDate(curr_item$!, 'delete')">
                <ElIcon><Calendar/></ElIcon>
                删除截止日期
            </VContextmenuItem>
            <VContextmenuDivider/>
            <VContextmenuItem >
                <ElIcon><DocumentRemove/></ElIcon>
                将任务移动到
            </VContextmenuItem>
            <VContextmenuDivider/>
            <VContextmenuItem @click="taskStore.delTask">
                <ElIcon><Delete/></ElIcon>
                删除任务
            </VContextmenuItem>
        </div>
    </VContextmenu>
</template>

<style lang="scss" scoped>

.tasks-title {
    display: inline-flex;
    align-items: center;
    padding: 12px 0;
    cursor: pointer;

    :deep(.el-icon) {
        margin-right: 10px;
        transition: transform .3s ease;
    }

    &:hover {
        color: var(--el-color-primary);
    }
}

.tasks-wrap.is-opened :deep(.el-icon) {
    transform: rotateZ(90deg);
}

.task-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    padding: 10px 15px;
    background-color: var(--bg-color);
    border-radius: 5px;
    box-sizing: border-box;
    margin-bottom: 10px;


    .check-wrap {
        position: absolute;
        left: 15px;
        top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        border: 2px solid #ddd;
        border-radius: 50%;
        cursor: pointer;

        :deep(.el-icon) {
            opacity: 0;
        }

        &:hover,
        &.is-finished {
            :deep(.el-icon) {
                opacity: 1;
            }
        }
    }

    &-inner {
        padding-left : 30px;
        flex: 1;
        overflow: hidden;

        &-top {
            display: flex;

            &__name {
                flex: 1;
                line-height: 1.5;
                padding-right: 10px;
            }
        }

        &-bottom {
            margin-top: 6px;
            font-size: 12px;
            color: var(--el-text-color-placeholder);

            > span {
                position: relative;
                display: inline-block;
            }

            > span + span {
                margin-left: 18px;

                &::before {
                    content: '';
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    border-radius: 50%;
                    background-color: #999;
                    top: 0;
                    left: 0;
                    transform: translate(-10px, 4px);
                }
            }
        }
    }
}

.input-task .el-input__wrapper {
    box-shadow: none;
    background-color: var(--bg-color);
    transition: background-color .2s ease;

    &:hover,
    &.is-focus {
        background-color: var(--bg-color-hover);
    }
}
</style>

