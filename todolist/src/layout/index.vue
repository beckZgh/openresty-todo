<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import {
    Sunny,
    Star,
    Calendar,
    House,
    Setting,
    Box,
    User,
    SwitchButton
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
        SwitchButton
    },

    setup() {
        const m = reactive({
            navs: [
                { icon: 'Sunny'   , title: '我的一天', path: '/tasks/myday'     },
                { icon: 'Star'    , title: '重要'    , path: '/tasks/important' },
                { icon: 'Calendar', title: '计划内'  , path: '/tasks/planned'   },
                { icon: 'House'   , title: '任务'    , path: '/tasks/inbox'     },
            ]
        })

        const navs$ = computed(() => {
            return m.navs.map(nav => ({ ...nav, qty: 0 }))
        })

        return {
            m,
            navs$,
        }
    }
})
</script>

<template>
    <div class="layout">
        <div class="layout-header">
            <div class="layout-header-logo">
                <ElIcon style="margin-right: 6px;">
                    <Box />
                </ElIcon>
                To Do
            </div>
            <div class="layout-header-inner">
                <div class="layout-header-inner__left"></div>
                <ElButton text>
                    <ElIcon :size="18"><Setting /></ElIcon>
                </ElButton>

                <ElDropdown>
                    <ElButton text>
                        <ElIcon :size="18"><User /></ElIcon>
                        <span>朱国华</span>
                    </ElButton>
                    <template #dropdown>
                        <ElDropdownItem>
                            <ElIcon><SwitchButton /></ElIcon>
                            退出登录
                        </ElDropdownItem>
                    </template>
                </ElDropdown>
            </div>
        </div>
        <div class="layout-aside">
            <div class="tasks-nav">
                <template v-for="item in navs$" :key="item.path" >
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
                        <div v-if="item.qty" class="tasks-nav-item__qty">
                            {{ item.qty }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="layout-main">
            <RouterView></RouterView>
        </div>
    </div>
</template>

