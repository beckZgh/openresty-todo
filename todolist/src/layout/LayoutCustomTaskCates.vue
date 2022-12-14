<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue'
import { useTaskCateStore, useTaskStore } from '@/store'
import { useRouter } from 'vue-router'

import AppFormDialog from '@/components/AppFormDialog.vue'
import Sortable from 'sortablejs'

type NavSubmenuItem = $api.$dd_task_cate & { children: $api.$dd_task_cate[]; opened: boolean; }
type NavItem        = $api.$dd_task_cate | NavSubmenuItem

export default defineComponent({
    name: 'LayoutCustomTaskCates',
    components: { AppFormDialog },
    props: {
        size: { type: Number, default: 30 }
    },
    emits: ['switch'],
    setup() {
        const form_dialog_ref   = ref()
        const contextmenu_ref   = ref()
        const $router           = useRouter()
        const taskCateStore     = useTaskCateStore()
        const taskStore         = useTaskStore()
        const navs              = ref<NavItem[]>([])
        const opened_ids        = ref<string[]>([]) // 展开的分组
        const sortable_instance = {} as Record<string, InstanceType<typeof Sortable>>

        // 当前右键菜单编辑项
        const curr_item$ = computed(() => taskCateStore.curr_edit_item)

        // 自定义列表分组
        const group_navs$ = computed(() => navs.value.filter(item => item.task_cate_type === 0))

        // 更新自定义列表
        watch(() => taskCateStore.task_cates, (task_cates) => {
            const map = {} as Record<string, NavItem[]>
            const arr = [] as NavSubmenuItem[]

            task_cates.forEach(item => {
                if (item.task_cate_pid) {
                    map[item.task_cate_pid] = (map[item.task_cate_pid] || []) as NavItem[]
                    map[item.task_cate_pid].push(item)
                }
            })

            task_cates.forEach(item => {
                if (!item.task_cate_pid) {
                    const o = {
                        ...item ,
                        opened  : opened_ids.value.includes(item.task_cate_id),
                        children: map[item.task_cate_id] || []
                    }
                    arr.push(o)
                }
            })

            // 分组中含有激活项，展开当前分组
            const task_cate_id = $router.currentRoute.value.params.id
            if (task_cate_id) {
                for(const item of arr) {
                    if (item.task_cate_type === 0 && item.children.length) {
                        // 展开已激活项的分组
                        const is_has = item.children.some(c => c.task_cate_id === task_cate_id)
                        if (is_has) item.opened = true

                        // 排序分组列表 (无排序值，创建时间越晚排越前)
                        item.children.sort((a, b) => {
                            return a.list_index - b.list_index || Number(b.task_cate_id) - Number(a.task_cate_id)
                        })
                    }
                }
            }

            navs.value = arr
        }, { immediate: true, deep: true })

        // 处理导航分组展开、收起
        function handleNavGroupClick(item: { task_cate_id: string; opened: boolean }) {
            const opened = !item.opened
            if (opened) {
                opened_ids.value.push(item.task_cate_id)
            } else {
                const idx = opened_ids.value.indexOf(item.task_cate_id)
                idx !== -1 && opened_ids.value.splice(idx, 1)
            }

            item.opened = opened
        }

        // 列表右键菜单指令
        async function handleTaskCateContextmenu(command: 'rename' | 'move' | 'copy' | 'remove', item?: $api.$dd_task_cate) {
            if (!taskCateStore.curr_edit_item) return

            switch(command) {
                case 'rename': return taskCateStore.renameTaskCate()
                case 'move'  : return taskCateStore.moveTaskCate(item)
                case 'copy'  : return taskCateStore.copyTaskCate(item!)
                case 'remove': return taskCateStore.delTaskCate()
            }
        }

        // 列表分组右键菜单指令
        async function handleTaskCateGroupContextmenu(command: 'rename' | 'add' | 'remove') {
            const item = taskCateStore.curr_edit_item
            if ( !item ) return

            switch(command) {
                case 'add'   : return taskCateStore.addTaskCateGroup()
                case 'rename': return taskCateStore.renameTaskCateGroup()
                case 'remove': return taskCateStore.delTaskCateGroup()
            }
        }

        onMounted(() => {
            // 绑定当前弹窗表单组件
            taskCateStore.setFormDialogRef(form_dialog_ref.value)
            taskCateStore.setContextmenuRef(contextmenu_ref.value)

            updateCustomNavsSortContainer()
            updateCustomNavSubmenusSortContainer()
        })

        // 更新排序列表
        function updateCustomNavsSortContainer() {
            const el = document.getElementById('task-list')
            if ( !el ) return

            // 一级列表排序容器
            new Sortable(el, {
                group    : 'task',
                animation: 150,
                onEnd: async (evt) => {
                    sortList({ oldIndex: evt.oldIndex!, newIndex: evt.newIndex! }, navs.value)
                },
            })
        }

        // 更新排序列表容器
        function updateCustomNavSubmenusSortContainer() {
            // 清除已有实例
            Object.entries(sortable_instance).forEach(([_, item]) => {
                item.destroy()
            })

            // 重新创建
            document.querySelectorAll('.nav-submenu-body').forEach((el) => {
                const id = el.getAttribute('data-id')
                if ( !id ) return

                const item = navs.value.find(item => item.task_cate_id === id && item.task_cate_type === 0) as NavSubmenuItem
                if ( !item ) return

                // 缓存当前实例
                sortable_instance[id] = new Sortable(el as HTMLElement, {
                    group    : `task_${ id }`,
                    animation: 150,
                    onEnd: async (evt) => {
                        sortList({ oldIndex: evt.oldIndex!, newIndex: evt.newIndex! }, item.children)
                    },
                })
            })
        }

        // 排序列表
        function sortList(evt: { oldIndex: number; newIndex: number }, list: { task_cate_id: string; list_index: number }[]) {
            // 取得拖拽前的顺序
            const old_ids = list.map(item => item.task_cate_id)

            // 保持列表拖拽顺序
            const oldIndex = evt.oldIndex!
            const newIndex = evt.newIndex!
            const item = list.splice(oldIndex, 1)[0]!
            list.splice(newIndex, 0, item)
            list.forEach((item, idx) => {
                item.list_index = idx
            })

            // 未发生顺序变化，不发送请求
            const ids = list.map(item => item.task_cate_id)
            if (old_ids.join('') === ids.join('')) return

            $api.dd.task_cate.sort({ ids }, { showLoding: true })
        }

        return {
            navs,
            form_dialog_ref,
            contextmenu_ref,
            curr_item$,
            group_navs$,
            taskCateStore,
            taskStore,
            handleNavGroupClick,
            handleTaskCateContextmenu,
            handleTaskCateGroupContextmenu
        }
    }
})
</script>

<template>
    <AppFormDialog ref="form_dialog_ref" />

    <div class="custom-task-list" id="task-list">
        <template v-for="item in navs" :key="item.task_cate_id" >
            <div
                v-if="item.task_cate_type === 0 && 'children' in item"
                :index="item.task_cate_id"
                class="nav-submenu"
                :class="{ 'is-opened': item.opened }"
            >
                <div
                    class="nav-submenu__title"
                    v-contextmenu:contextmenu_ref
                    @contextmenu.prevent="taskCateStore.setCurrEditItem(item)"
                    @click="handleNavGroupClick(item)"
                >
                    <ElIcon :size="16"><Folder /></ElIcon>
                    <div class="nav-submenu__title-content">
                        {{ item.task_cate_name }}
                    </div>
                    <ElIcon :size="16" class="nav-submenu__arrow"><ArrowDown /></ElIcon>
                </div>
                <div
                    class="nav-submenu-body"
                    :style="{ maxHeight: item.opened ? `${ item.children.length * (36 + 2) }px` : 0 }"
                    :data-id="item.task_cate_id"
                    @contextmenu.stop
                >
                    <template v-for="child in item.children" :key="child.task_cate_id">
                        <div
                            class="nav-item"
                            :class="{ 'is-active': $route.params.id === child.task_cate_id }"
                            :index="child.task_cate_id"
                            v-contextmenu:contextmenu_ref
                            @contextmenu.prevent="taskCateStore.setCurrEditItem(child)"
                            @click="$emit('switch', child)"
                        >
                            <ElIcon :size="16"><Sort /></ElIcon>
                            <div class="nav-item__title">
                                {{ child.task_cate_name }}
                            </div>
                            <div v-if="(taskStore.task$[child.task_cate_id] || []).length" class="nav-item__qty">
                                {{ taskStore.task$[child.task_cate_id].length }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            <div
                v-else
                class="nav-item"
                :class="{ 'is-active': $route.params.id === item.task_cate_id }"
                v-contextmenu:contextmenu_ref
                @contextmenu.prevent="taskCateStore.setCurrEditItem(item)"
                @click="$emit('switch', item)"
            >
                <ElIcon :size="16"><Sort /></ElIcon>
                <div class="nav-item__title">
                    {{ item.task_cate_name }}
                </div>
                <div v-if="(taskStore.task$[item.task_cate_id] || []).length" class="nav-item__qty">
                    {{ taskStore.task$[item.task_cate_id].length }}
                </div>
            </div>
        </template>
    </div>

    <!-- 自定义列表右键菜单 -->
    <VContextmenu ref="contextmenu_ref" >
        <div style="width: 160px">
            <template v-if="curr_item$?.task_cate_type === 1">
                <VContextmenuItem @click="handleTaskCateContextmenu('rename')" >
                    <ElIcon><Edit/></ElIcon>
                    重命名列表
                </VContextmenuItem>
                <VContextmenuSubmenu title="">
                    <template #title>
                        <ElIcon><Folder /></ElIcon>
                        将列表移动到
                    </template>

                    <template v-for="group in group_navs$" :key="group.task_cate_id">
                        <VContextmenuItem
                            style="width: 150px"

                            v-if="group.task_cate_id !== curr_item$.task_cate_pid"
                            @click="handleTaskCateContextmenu('move', group)"
                        >
                            <ElIcon><Folder /></ElIcon>
                            {{ group.task_cate_name }}
                        </VContextmenuItem>
                    </template>
                </VContextmenuSubmenu>
                <VContextmenuItem
                    v-if="curr_item$?.task_cate_pid"

                    @click="handleTaskCateContextmenu('move')"
                >
                    <ElIcon><FolderRemove /></ElIcon>
                    从组中删除
                </VContextmenuItem>
                <VContextmenuItem @click="handleTaskCateContextmenu('copy')" >
                    <ElIcon><CopyDocument /></ElIcon>
                    复制列表
                </VContextmenuItem>
                <VContextmenuItem @click="handleTaskCateContextmenu('remove')" >
                    <ElIcon><Delete  /></ElIcon>
                    删除列表
                </VContextmenuItem>
            </template>
            <template v-if="curr_item$?.task_cate_type === 0">
                <VContextmenuItem @click="handleTaskCateGroupContextmenu('rename')" >
                    <ElIcon><Edit/></ElIcon>
                    重命名分组
                </VContextmenuItem>
                <VContextmenuItem @click="handleTaskCateGroupContextmenu('add')" >
                    <ElIcon><DocumentAdd /></ElIcon>
                    新建列表
                </VContextmenuItem>
                <VContextmenuItem @click="handleTaskCateGroupContextmenu('remove')" >
                    <ElIcon><FolderDelete /></ElIcon>
                    取消分组
                </VContextmenuItem>
            </template>
        </div>
    </VContextmenu>
</template>

<style lang="scss" scoped>
.app-logo {
    position: relative;
    display: inline-block;
    background-color: var(--el-color-primary);
    border-radius: 10px 5px 20px 5px;
    padding: 4px 6px;
    margin-right: 10px;
}
</style>

