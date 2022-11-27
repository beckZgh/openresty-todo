<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'TaskItem',
    props: {
        item: { type: Object as PropType<$api.$dd_todo>, required: true }
    },
})
</script>

<template>
    <ElPopover
        placement="bottom"
        :width="200"
        :show-arrow="false"
        :offset="-20"
        :hide-after="0"
        trigger="contextmenu"
    >
        <template #reference>
            <div class="task-item">
                <div class="task-item-top">
                    <ElCheckbox></ElCheckbox>
                    <span class="task-item-top__name">{{ item.todo_name }}</span>
                    <ElIcon :size="20">
                        <component :is="item.is_important === 1 ? 'StarFilled' : 'Star'" />
                    </ElIcon>
                </div>
                <div class="task-item-bottom">

                </div>
            </div>
        </template>
        <div>
            <div>添加到我的一天</div>
            <div>标记为重要</div>
            <div>标记为已完成</div>
            <ElDivider />
            <div>今天到期</div>
            <div>明天到期</div>
            <div>选择日期</div>
            <ElDivider />
            <div>将任务移动到</div>
            <ElDivider />
            <div>删除任务</div>
        </div>
    </ElPopover>
</template>

<style lang="scss" scoped>
.task-item {
    list-style: none;
    padding: 10px 15px;
    background-color: var(--bg-color);
    border-radius: 5px;
    box-sizing: border-box;
    margin: 0;

    &-top {
        display: flex;
        align-items: center;

        &__name {
            flex: 1;
            padding: 0 15px;
        }
    }
}
</style>

