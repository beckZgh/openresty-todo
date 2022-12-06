<script lang="ts">
import type { PropType, Component } from 'vue'
import { defineComponent, reactive, ref, watch } from 'vue'

import AppDialog from './AppDialog.vue'
import AppForm   from './AppForm.vue'

interface FormConfig {
    tag : Component | string
    id  : string
    name: string
    props?: Record<string, any>
    rules?: any
    value?: 0,
}

export default defineComponent({
    name: 'AppFormDialog',
    inheritAttrs: false,
    components: { AppDialog, AppForm },
    props: {
        modelValue   : { type: Boolean, default: false },
        labelWidth   : { type: Number , default: 100   },
        labelPosition: { type: String , default: 'top' },
        title        : { type: String , default: ''    },
        config       : { type: Array as PropType<FormConfig[]>, default: () => [] },
        model        : { type: Object as PropType<Record<string, any>>, default: () => ({}) },
        submit       : { type: Function },
    },
    emits: ['update:modelValue', 'submit'],
    setup(props, { emit }) {
        // 提交函数
        let submit_fn = props.submit

        // 表单组件引用
        const form_ref = ref()

        // 组件数据
        const m = reactive({
            model          : props.model || {},
            labelWidth     : props.labelWidth,
            labelPosition  : props.labelPosition,
            title          : props.title,
            visible        : props.modelValue,
            config         : props.config,
            visible_by_show: false, // 是否通过 show 函数显示的弹窗
        })

        // 同步显示、隐藏状态
        watch(() => m.visible, (visible) => {
            emit('update:modelValue', visible)
        })
        watch(() => props.modelValue, (modelValue) => {
            m.visible = modelValue
        })

        function show(params: {
            config        : FormConfig[];
            model        ?: Record<string, any>;
            labelWidth   ?: number;
            labelPosition?: string
            title        ?: string;
            submit       ?: Function;
        }) {
            submit_fn = params.submit

            if (params.title         ) m.title         = params.title
            if (params.labelWidth    ) m.labelWidth    = params.labelWidth
            if (params.labelPosition ) m.labelPosition = params.labelPosition
            if (params.model         ) m.model         = params.model
            if (params.config        ) m.config        = params.config

            m.visible_by_show = true
            m.visible         = true
        }

        function hide() {
            m.config  = []
            m.visible = false
        }

        // 对整个表单作验证。 参数为一个回调函数。
        const validate = async (alertMessage = false): Promise<boolean> => {
            const $elForm = form_ref.value
            if ( !$elForm ) return Promise.resolve(false)

            return await $elForm.validate(alertMessage)
        }

        // 对部分表单字段进行校验的方法
        const validateField = async (props?: string | string[], alertMessage = false): Promise<boolean> => {
            const $elForm = form_ref.value
            if ( !$elForm ) return Promise.resolve(false)

            return await $elForm.validateField(props, alertMessage)
        }

        // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
        const resetFields = () => {
            const $elForm = form_ref.value
            if ( !$elForm ) return

            $elForm.resetFields()
        }

        // 滚动到指定表单字段 Function(prop: string)
        const scrollToField = (prop: string) => {
            const $elForm = form_ref.value
            if ( !$elForm ) return

            $elForm.scrollToField(prop)
        }

        // 清理指定字段的表单验证信息。 参数是一个或多个需要清除验证信息的表
        const clearValidate = (props?: string | string[]) => {
            const $elForm = form_ref.value
            if ( !$elForm ) return

            $elForm.clearValidate(props)
        }

        // 处理提交
        async function handleSubmit() {
            // 取得表单引用
            const $form = form_ref.value
            if ( !$form ) return

            // 校验表单
            const valid = await $form.validate()
            if ( !valid ) return

            // 未传入提交函数，则抛出事件处理
            if (!$utils.isFunction(submit_fn)) {
                emit('submit', m.model)
            } else {
                // 执行提交函数
                const result = await submit_fn(m.model)
                if ( !result ) return

                m.visible = false
            }
        }

        // 打开弹窗时恢复组件传入的 model
        function onOpen() {
            if (!m.visible_by_show) {
                m.model = props.model
            }
        }

        // 关闭弹窗时，清除数据
        function onClosed() {
            // 取得表单引用
            const $form = form_ref.value
            if ( !$form ) return

            $form.clearValidate()
            m.visible_by_show = false
            m.model           = {}
        }

        return {
            m,
            form_ref,
            onOpen,
            onClosed,
            show,
            hide,
            validate,
            validateField,
            resetFields,
            scrollToField,
            clearValidate,
            handleSubmit,
        }
    }
})
</script>

<template>
    <AppDialog v-model="m.visible" :title="m.title" v-bind="$attrs" @confirm="handleSubmit" @open="onOpen" @closed="onClosed">
        <div style="padding: 20px 0">
            <AppForm
                ref="form_ref"
                :model="m.model"
                :config="m.config"
                :labelWidth="m.labelWidth"
                :labelPosition="m.labelPosition"
                @submit="handleSubmit"
            />
        </div>
    </AppDialog>
</template>
