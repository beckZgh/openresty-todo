<script lang="ts">
import { defineComponent           } from 'vue'
import { useRouter                 } from 'vue-router'
import { useAppStore, useTodoStore } from '@/store'

import AppLogo from '@/components/AppLogo.vue'

export default defineComponent({
    components: { AppLogo },
    setup() {
        const todoStore = useTodoStore()
        const appStore  = useAppStore()
        const $router   = useRouter()

        // 处理用户指令
        function handleCommand(command: string) {
            switch(command) {
                case 'logout': {
                    appStore.logout()
                    return
                }
                case 'setting': {
                    $router.push('setting')
                    return
                }
            }
        }

        // 切换导航
        function handleSwitchNav(item: typeof appStore.navs[0] | $api.$dd_todo_cate) {
            appStore.curr_nav = item
            $router.push(`/tasks/${ 'todo_cate_id' in item ? item.todo_cate_id : item.id }`)
        }

        return {
            appStore,
            todoStore,
            handleCommand,
            handleSwitchNav,
        }
    }
})
</script>

<template>
    <div class="layout">
        <!-- 侧边栏 -->
        <div class="layout-aside">

            <!-- 用户信息、快速搜索、固定菜单导航 -->
            <div class="layout-aside-header">
                <div class="flex">
                    <div class="logo-wrap flex-1">
                        <AppLogo :size="20" />
                        <span>ToDo</span>
                    </div>

                    <ElDropdown @command="handleCommand">
                        <div style="cursor: pointer; display: flex; align-items: center;">
                            <ElAvatar :size="30">
                                <img src="@/assets/user-avtar.jpg" />
                            </ElAvatar>
                            <ElIcon style="display: inline-block; margin-left: 5px;"><ArrowDown /></ElIcon>
                        </div>
                        <template #dropdown>
                            <ElDropdownItem command="setting">
                                <ElIcon><Setting /></ElIcon>
                                设置
                            </ElDropdownItem>
                            <ElDropdownItem command="logout">
                                <ElIcon><SwitchButton /></ElIcon>
                                退出登录
                            </ElDropdownItem>
                        </template>
                    </ElDropdown>
                </div>

                <ElInput
                    v-model="todoStore.search_val"
                    prefix-icon="Search"
                    placeholder="快速搜索..."
                    style="margin: 15px 0;"
                    @focus="todoStore.setSearchFocus(true)"
                    @blur="todoStore.setSearchFocus(false)"
                />

                <template v-for="item in appStore.navs$" :key="item.path" >
                    <div
                        v-if="item.show"
                        class="tasks-nav-item"
                        :class="{ 'is-active': $route.path === item.path }"
                        @click="handleSwitchNav(item)"
                    >
                        <ElIcon :size="16" >
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

            <!-- 自定义列表 -->
            <div class="layout-aside-body">
                <ElScrollbar height="100%">
                    <div class="tasks-cate">
                        <template v-for="item in todoStore.task_cates" :key="item.todo_cate_id" >
                            <ElPopover :width="200" trigger="contextmenu" :hide-after="0">
                                <template #reference>
                                    <div
                                        class="tasks-nav-item"
                                        :class="{ 'is-active': $route.params.id === item.todo_cate_id }"
                                        @click="handleSwitchNav(item)"
                                    >
                                        <ElIcon :size="16"><Sort /></ElIcon>
                                        <div class="tasks-nav-item__title">
                                            {{ item.todo_cate_name }}
                                        </div>
                                        <div v-if="todoStore.len$[item.todo_cate_id]" class="tasks-nav-item__qty">
                                            {{ todoStore.len$[item.todo_cate_id] }}
                                        </div>
                                    </div>
                                </template>
                                <div>
                                    <div @click="todoStore.setTaskCate(item)">重命名</div>
                                    <div @click="todoStore.delTaskCate(item)">删除</div>
                                </div>
                            </ElPopover>
                        </template>
                    </div>
                </ElScrollbar>
            </div>

            <!-- 新建列表、目录 -->
            <div class="layout-aside-footer">
                <div class="layout-aside-footer-left">
                    <ElButton text @click="todoStore.addTaskCate">
                        <ElIcon><Plus /></ElIcon>
                        <span style="position: relative; top: 2px;">新建列表</span>
                    </ElButton>
                </div>
                <!-- <ElButton text>
                    <ElIcon :size="18"><FolderAdd /></ElIcon>
                </ElButton> -->
            </div>
        </div>

        <!-- 主区域 -->
        <div class="layout-main">
            <RouterView :key="$route.fullPath" />
        </div>
    </div>
</template>

