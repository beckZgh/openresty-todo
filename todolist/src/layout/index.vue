<script lang="ts">
import { defineComponent, ref      } from 'vue'
import { useAppStore, useTodoStore } from '@/store'

import AppLogo from '@/components/AppLogo.vue'
import {
    Sunny,
    Star,
    Calendar,
    House,
    Setting,
    Box,
    User,
    SwitchButton,
    Search,
    Plus,
    FolderAdd,
    Sort,
} from '@element-plus/icons-vue'

export default defineComponent({
    components: {
        Sunny,
        Star,
        Calendar,
        House,
        Setting,
        Box,
        User,
        Plus,
        FolderAdd,
        Sort,
        SwitchButton,
        AppLogo,
    },

    setup() {
        const todoStore = useTodoStore()

        const navs = ref([
            { icon: 'Sunny'   , title: '我的一天', path: '/tasks/myday'         , id: 'myday'        },
            { icon: 'Star'    , title: '重要'    , path: '/tasks/important'     , id: 'important'    },
            { icon: 'Calendar', title: '计划内'  , path: '/tasks/closing_date'  , id: 'closing_date' },
            { icon: 'House'   , title: '任务'    , path: '/tasks/inbox'         , id: 'inbox'        },
        ])

        function handleCommand(command: string) {
            switch(command) {
                case 'logout': {
                    useAppStore().logout()
                    return
                }
            }
        }

        return {
            todoStore,
            navs,
            handleCommand,
            Search
        }
    }
})
</script>

<template>
    <div class="layout">
        <div class="layout-header">
            <div class="layout-header-logo">
                <AppLogo :size="20"></AppLogo>
                <span>OpenResty Todo</span>
            </div>
            <div class="layout-header-inner">
                <div class="layout-header-inner__left"></div>
                <ElButton text>
                    <ElIcon :size="18"><Setting /></ElIcon>
                </ElButton>

                <ElDropdown @command="handleCommand">
                    <ElButton text>
                        <ElIcon :size="18"><User /></ElIcon>
                        <span>朱国华</span>
                    </ElButton>
                    <template #dropdown>
                        <ElDropdownItem command="logout">
                            <ElIcon><SwitchButton /></ElIcon>
                            退出登录
                        </ElDropdownItem>
                    </template>
                </ElDropdown>
            </div>

            <div class="layout-header-search">
                <ElInput
                    v-model="todoStore.search_val"
                    :prefix-icon="Search"
                    placeholder="快速搜索..."
                    @focus="todoStore.setSearchFocus(true)"
                    @blur="todoStore.setSearchFocus(false)"
                />
            </div>
        </div>
        <div class="layout-aside">
            <div class="layout-aside-header">
                <template v-for="item in navs" :key="item.path" >
                    <div
                        class="tasks-nav-item"
                        :class="{ 'is-active': $route.path === item.path }"
                        @click="$router.push(item.path)"
                    >
                        <ElIcon :size="16">
                            <component :is="item.icon" />
                        </ElIcon>
                        <div class="tasks-nav-item__title">
                            {{ item.title }}
                        </div>
                        <div v-if="todoStore.len$[item.id]" class="tasks-nav-item__qty">
                            {{ todoStore.len$[item.id] }}
                        </div>
                    </div>
                </template>
            </div>
            <div class="layout-aside-body">
                <ElScrollbar height="100%">
                    <div class="tasks-cate">
                        <template v-for="item in todoStore.task_cates" :key="item.todo_cate_id" >
                            <div
                                class="tasks-nav-item"
                                :class="{ 'is-active': $route.params.id === item.todo_cate_id }"
                                @click="$router.push(`/tasks/${ item.todo_cate_id }`)"
                            >
                                <ElIcon :size="16">
                                    <Sort />
                                </ElIcon>
                                <div class="tasks-nav-item__title">
                                    {{ item.todo_cate_name }}
                                </div>
                                <div v-if="todoStore.len$[item.todo_cate_id]" class="tasks-nav-item__qty">
                                    {{ todoStore.len$[item.todo_cate_id] }}
                                </div>

                                <!-- <ElButton @click="todoStore.setTaskCate(item)">修改</ElButton>
                                <ElButton @click="todoStore.delTaskCate(item)">删除</ElButton> -->
                            </div>
                        </template>
                    </div>
                </ElScrollbar>
            </div>
            <div class="layout-aside-footer">
                <div class="layout-aside-footer-left">
                    <ElButton text @click="todoStore.addTaskCate">
                        <ElIcon ><Plus /></ElIcon>
                        <span style="position: relative; top: 2px;">新建列表</span>
                    </ElButton>
                </div>
                <!-- <ElButton text>
                    <ElIcon :size="18"><FolderAdd /></ElIcon>
                </ElButton> -->
            </div>
        </div>
        <div class="layout-main">
            <RouterView :key="$route.fullPath"></RouterView>
        </div>
    </div>
</template>

