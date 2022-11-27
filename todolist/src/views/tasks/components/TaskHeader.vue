<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { useAppStore } from '@/store'

import Img1 from '@/assets/theme-bg/img1.jpg'
import Img2 from '@/assets/theme-bg/img2.jpg'
import Img3 from '@/assets/theme-bg/img3.jpg'
import Img4 from '@/assets/theme-bg/img4.jpg'
import Img5 from '@/assets/theme-bg/img5.jpg'
import Img6 from '@/assets/theme-bg/img6.jpg'
import Img7 from '@/assets/theme-bg/img7.jpg'
import Img8 from '@/assets/theme-bg/img8.jpg'

export default defineComponent({
    name: 'TaskHeader',
    setup() {
        const appStore  = useAppStore()
        const curr_nav$ = computed(() => {
            const nav = appStore.curr_nav
            return {
                icon : 'icon'  in nav ? nav.icon  : '',
                title: 'title' in nav ? nav.title : nav.todo_cate_name,
            }
        })

        const themes = ref([
            { type: 'image', value: Img1 },
            { type: 'image', value: Img2 },
            { type: 'image', value: Img3 },
            { type: 'image', value: Img4 },
            { type: 'image', value: Img5 },
            { type: 'image', value: Img6 },
            { type: 'image', value: Img7 },
            { type: 'image', value: Img8 },
        ])

        return { curr_nav$, themes }
    }
})
</script>

<template>
    <div class="task-header">
        <div class="task-header-left">
            <ElIcon v-if="curr_nav$.icon" :size="20">
                <component :is="curr_nav$.icon" />
            </ElIcon>
            <span class="task-header-left__title">
                {{ curr_nav$.title }}
            </span>
        </div>
        <slot name="extra" />
        <ElButton text>
            <ElIcon><MoreFilled /></ElIcon>
        </ElButton>
    </div>
</template>

<style lang="scss" scoped>
.task-header {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    &-left {
        flex: 1;
        display: flex;
        align-items: center;

        &__title {
            margin-left: 12px;
            font-size: 20px;
        }
    }
}
</style>

