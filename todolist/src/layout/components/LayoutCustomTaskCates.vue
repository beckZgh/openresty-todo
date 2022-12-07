<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { useTaskCateStore, useTaskStore } from '@/store'
import { useRouter } from 'vue-router'

type NavSubmenuItem = $api.$dd_task_cate & { children: $api.$dd_task_cate[]; opened: boolean; }
type NavItem        = $api.$dd_task_cate | NavSubmenuItem

export default defineComponent({
    name: 'LayoutCustomTaskCates',
    props: {
        size: { type: Number, default: 30 }
    },
    emits: ['switch'],
    setup() {

        const $router       = useRouter()
        const taskCateStore = useTaskCateStore()
        const taskStore     = useTaskStore()
        const navs          = ref<NavItem[]>([])
        const opened_ids    = ref<string[]>([]) // 展开的分组

        // 当前右键菜单编辑项
        const curr_item$ = computed(() => taskCateStore.curr_contextmenu_item)

        // 自定义列表分组
        const group_navs$ = computed(() => navs.value.filter(item => item.task_cate_type === 0))

        // 更新自定义列表
        watch(() => taskCateStore.task_cates, (task_cates) => {
            const map = {} as Record<string, NavSubmenuItem>
            const arr = [] as NavSubmenuItem[]

            task_cates.forEach(item => {
                if (item.task_cate_pid === '') {
                    const o = {
                        ...item ,
                        opened  : opened_ids.value.includes(item.task_cate_id),
                        children: []
                    }
                    map[item.task_cate_id] = o
                    arr.push(o)
                } else {
                    const nav = map[item.task_cate_pid]
                    nav && nav.children!.push(item)
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

        return {
            navs,
            curr_item$,
            group_navs$,
            taskCateStore,
            taskStore,
            handleNavGroupClick
        }
    }
})
</script>

<template>
    <div class="custom-task-list">
        <template v-for="item in navs" :key="item.task_cate_id" >
            <div
                v-if="item.task_cate_type === 0 && 'children' in item"
                :index="item.task_cate_id"
                class="nav-submenu"
                :class="{ 'is-opened': item.opened }"
            >
                <div
                    class="nav-submenu__title"
                    v-contextmenu:contextmenu
                    @contextmenu.prevent="taskCateStore.setCurrContextmenuItem(item)"
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
                    :style="{ maxHeight: item.opened ? `${ item.children.length * 36 }px` : 0 }"
                    @contextmenu.stop
                >
                    <template v-for="child in item.children" :key="child.task_cate_id">
                        <div
                            class="nav-item"
                            :class="{ 'is-active': $route.params.id === child.task_cate_id }"
                            :index="child.task_cate_id"
                            v-contextmenu:contextmenu
                            @contextmenu.prevent="taskCateStore.setCurrContextmenuItem(child)"
                            @click="$emit('switch', child)"
                        >
                            <ElIcon :size="16"><Sort /></ElIcon>
                            <div class="nav-item__title">
                                {{ child.task_cate_name }}
                            </div>
                            <div class="nav-item__qty">
                                10
                            </div>
                            <!-- <div v-if="todoStore.len$[child.task_cate_id]" class="nav-item__qty">
                                {{ todoStore.len$[child.task_cate_id] || 10 }}
                            </div> -->
                        </div>
                    </template>
                </div>
            </div>
            <div
                v-else
                class="nav-item"
                :class="{ 'is-active': $route.params.id === item.task_cate_id }"
                v-contextmenu:contextmenu
                @contextmenu.prevent="taskCateStore.setCurrContextmenuItem(item)"
                @click="$emit('switch', item)"
            >
                <ElIcon :size="16"><Sort /></ElIcon>
                <div class="nav-item__title">
                    {{ item.task_cate_name }}
                </div>
                <div class="nav-item__qty">
                    10
                </div>
                <div v-if="taskStore.len$[item.task_cate_id]" class="nav-item__qty">
                    {{ taskStore.len$[item.task_cate_id] }}
                </div>
            </div>
        </template>
    </div>

    <!-- 自定义列表右键菜单 -->
    <VContextmenu ref="contextmenu" >
        <div style="width: 150px">
            <template v-if="curr_item$?.task_cate_type === 1">
                <VContextmenuItem @click="taskCateStore.handleTaskCateContextmenu('rename')" >
                    重命名列表
                </VContextmenuItem>
                <VContextmenuSubmenu title="将列表移动到">
                    <template v-for="group in group_navs$" :key="group.task_cate_id">
                        <VContextmenuItem
                            style="width: 150px"
                            v-if="group.task_cate_id !== curr_item$.task_cate_pid"
                            @click="taskCateStore.handleTaskCateContextmenu('move', group)"
                        >
                            {{ group.task_cate_name }}
                        </VContextmenuItem>
                    </template>
                </VContextmenuSubmenu>
                <VContextmenuItem @click="taskCateStore.handleTaskCateContextmenu('copy')" >
                    复制列表
                </VContextmenuItem>
                <VContextmenuItem @click="taskCateStore.handleTaskCateContextmenu('remove')" >
                    删除列表
                </VContextmenuItem>
            </template>
            <template v-if="curr_item$?.task_cate_type === 0">
                <VContextmenuItem @click="taskCateStore.handleTaskCateGroupContextmenu('rename')" >
                    重命名分组
                </VContextmenuItem>
                <VContextmenuItem @click="taskCateStore.handleTaskCateGroupContextmenu('add')" >
                    新建列表
                </VContextmenuItem>
                <VContextmenuItem @click="taskCateStore.handleTaskCateGroupContextmenu('remove')" >
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

