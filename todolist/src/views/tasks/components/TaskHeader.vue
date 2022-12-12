<script lang="ts">
import type { PropType } from 'vue'

import { defineComponent, computed, ref } from 'vue'
import { useRouter   } from 'vue-router'
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
    props: {
        cates: { type: Array as PropType<$api.$dd_task_cate[]>, default: () => [] }
    },
    setup(props) {
        const $router   = useRouter()
        const appStore  = useAppStore()

        const curr_nav$ = computed((): IntelligenceNavItem | $api.$dd_task_cate => {
            const cate_id = $router.currentRoute.value.params.id as string
            if (appStore.nav_ids.includes(cate_id)) {
                return appStore.navs.find(item => item.id === cate_id)!
            } else {
                return props.cates.find(item => item.task_cate_id === cate_id)!
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
           <template v-if="'task_cate_id' in curr_nav$">
                <span class="task-header-left__title">
                    {{ curr_nav$.task_cate_name }}
                </span>
            </template>
            <template v-else>
                <ElIcon v-if="curr_nav$.icon" :size="20">
                    <component :is="curr_nav$.icon" />
                </ElIcon>
                <span class="task-header-left__title">
                    {{ curr_nav$.title }}
                </span>
            </template>
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

