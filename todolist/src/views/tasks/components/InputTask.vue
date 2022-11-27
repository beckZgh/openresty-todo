<script lang="ts">
import { defineComponent } from 'vue'
import { Box } from '@element-plus/icons-vue'

export default defineComponent({
    name: 'InputTask',
    props: {
        size: { type: Number, default: 30 }
    },
    components: { Box },
})
</script>

<template>
    <ElInput class="input-task" prefix-icon="Plus" size="large" placeholder="添加任务" />
</template>

<style lang="scss">
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

