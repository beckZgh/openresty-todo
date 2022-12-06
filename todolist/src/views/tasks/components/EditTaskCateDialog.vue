<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, computed, reactive } from 'vue'

export default defineComponent({
    name: 'EditTaskCateDialog',
    props: {
        modelValue: { type: Boolean, deafult: false          },
        item      : { type: Object as PropType<$api.$dd_task_cate> },
        title     : { type: String, default: '' }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {

        // 表单
        const m = reactive({
            form : {},
            rules: []
        })

        // 弹窗开关
        const visible$ = computed({
            get(){
                return props.modelValue
            },
            set(val) {
                emit('update:modelValue', val)
            }
        })

        // 弹窗标题
        const dialog_title$ = computed(() => {
            return props.item ? `修改${ props.title }` : `新建${ props.title }`
        })

        return {
            visible$,
            dialog_title$,
        }
    }
})
</script>

<template>
    <ElDialog
        v-model="visible$"
        :title="dialog_title$"
    >
        <ElForm>
            <ElFormItem>
                <ElInput></ElInput>
            </ElFormItem>
        </ElForm>
    </ElDialog>
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

