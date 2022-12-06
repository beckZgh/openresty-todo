<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRouter                 } from 'vue-router'
import {
    useAppStore,
    useTaskStore,
    useTaskCateStore,
} from '@/store'

import AppLogo from '@/components/AppLogo.vue'

export default defineComponent({
    components: { AppLogo },
    setup() {
        const appStore      = useAppStore()      // 应用数据
        const taskCateStore = useTaskCateStore() // 任务列表/分组数据
        const todoStore     = useTaskStore()     // 任务数据
        const $router       = useRouter()        // 路由实例

        // 当前导航编码
        const curr_nav_id$ = computed(() => {
            return ($router.currentRoute.value.params.id || '') as string
        })

        // 处理用户指令
        function handleCommand(command: string) {
            switch(command) {
                case 'logout' : return appStore.logout()
                case 'setting': return $router.push('setting')
            }
        }

        // 切换导航
        function handleSwitchNav(item: IntelligenceNavItem | $api.$dd_task_cate) {
            appStore.curr_nav = item
            $router.push(`/tasks/${ 'task_cate_id' in item ? item.task_cate_id : item.id }`)
        }

        return {
            curr_nav_id$,
            appStore,
            taskCateStore,
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
                    style="margin-bottom: 15px;"
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

            <v-contextmenu ref="task_cate_contextmenu" >
                <div style="width: 150px">
                    <v-contextmenu-item @click="taskCateStore.handleTaskCateContextmenu('rename')" >重命名列表</v-contextmenu-item>
                    <v-contextmenu-item @click="taskCateStore.handleTaskCateContextmenu('move')" >将列表移动到</v-contextmenu-item>
                    <v-contextmenu-item @click="taskCateStore.handleTaskCateContextmenu('copy')" >复制列表</v-contextmenu-item>
                    <v-contextmenu-item @click="taskCateStore.handleTaskCateContextmenu('remove')" >删除列表</v-contextmenu-item>
                </div>
            </v-contextmenu>

            <v-contextmenu ref="task_cate_group_contextmenu" >
                <div style="width: 150px">
                    <v-contextmenu-item>重命名分组</v-contextmenu-item>
                    <v-contextmenu-item>取消分组列表</v-contextmenu-item>
                </div>
            </v-contextmenu>

            <!-- 自定义列表 -->
            <div class="layout-aside-body">
                <ElScrollbar height="100%">
                    <div class="tasks-cate">
                        <ElMenu :default-active="curr_nav_id$" >

                            <template v-for="item in taskCateStore.task_cate_navs$" :key="item.task_cate_id" >
                                <ElSubMenu v-if="item.children && item.children.length" :index="item.task_cate_id">
                                    <template #title>
                                        <div  v-contextmenu:task_cate_group_contextmenu>
                                            {{ item.task_cate_name }}
                                        </div>
                                    </template>
                                    <template v-for="child in item.children" :key="child.task_cate_id">
                                        <ElMenuItem
                                            class="tasks-nav-item"
                                            :index="child.task_cate_id"
                                            v-contextmenu:task_cate_contextmenu
                                            @click="handleSwitchNav(item)"
                                            @contextmenu.prevent="taskCateStore.setCurrContextmenuItem(item)"
                                        >
                                            <ElIcon :size="16"><Sort /></ElIcon>
                                            <div class="tasks-nav-item__title">
                                                {{ child.task_cate_name }}
                                            </div>
                                            <div v-if="todoStore.len$[child.task_cate_id]" class="tasks-nav-item__qty">
                                                {{ todoStore.len$[child.task_cate_id] }}
                                            </div>
                                        </ElMenuItem>
                                    </template>
                                </ElSubMenu>
                                <ElMenuItem
                                    v-else
                                    class="tasks-nav-item"
                                    :index="item.task_cate_id"
                                    v-contextmenu:task_cate_contextmenu
                                    @contextmenu.prevent="taskCateStore.setCurrContextmenuItem(item)"
                                    @click="handleSwitchNav(item)"
                                >
                                    <ElIcon :size="16"><Sort /></ElIcon>
                                    <div class="tasks-nav-item__title">
                                        {{ item.task_cate_name }}
                                    </div>
                                    <div v-if="todoStore.len$[item.task_cate_id]" class="tasks-nav-item__qty">
                                        {{ todoStore.len$[item.task_cate_id] }}
                                    </div>
                                </ElMenuItem>
                            </template>
                        </ElMenu>
                    </div>
                </ElScrollbar>
            </div>

            <!-- 新建列表、目录 -->
            <div class="layout-aside-footer">
                <div class="layout-aside-footer-left">
                    <ElButton text @click="taskCateStore.addTaskCate">
                        <ElIcon><Plus /></ElIcon>
                        <span style="position: relative; top: 2px;">新建列表</span>
                    </ElButton>
                </div>
                <ElButton text @click="taskCateStore.addTaskCateGroup">
                    <ElIcon :size="18"><FolderAdd /></ElIcon>
                </ElButton>
            </div>
        </div>

        <!-- 主区域 -->
        <div class="layout-main">
            <RouterView :key="$route.fullPath" />
        </div>
    </div>
</template>

