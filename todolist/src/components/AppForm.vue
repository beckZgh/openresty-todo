<script lang="ts">
import type { PropType, Component } from 'vue'

import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'

interface FormConfig {
    tag : Component | string
    id  : string
    name: string
    props?: Record<string, any>
    rules?: any
    value?: 0,
}

export default defineComponent({
    name: 'AppForm',
    props: {
        labelWidth: { type: Number, default: 100 },
        config    : { type: Array as PropType<FormConfig[]>, default: () => [] },
        model     : { type: Object as PropType<Record<string, any>>, default: () => ({}) },
    },
    emits: ['submit'],
    setup(props) {
        const form_ref = ref()

        // 初始化默认值
        initConfig()
        function initConfig() {
            props.config.forEach(item => {
                 // model 默认值优先级最高
                 if (item.id in props.model) return

                if ('value' in item) {
                    props.model[item.id] = item.value  // 配置的默认值
                } else {
                    props.model[item.id] = undefined   // 默认为 undefined
                }
            })
        }

        // 对整个表单作验证。 参数为一个回调函数。
        const validate = (alertMessage = false): Promise<boolean> => {
            return new Promise((resolve) => {
                const $elForm = form_ref.value
                if ( !$elForm ) {
                    resolve(false)
                    return
                }

                $elForm.validate((isValid: boolean, invalidFields: any) => {
                    if (alertMessage && invalidFields) {
                        let err = ''
                        Object.keys(invalidFields).forEach((k) => {
                            invalidFields[k].forEach((f: any) => {
                                err += `<p style="margin-top: ${ err ? '5px' : '' }">${ f.message };</p>`
                            })
                        })

                        if (err) {
                            ElMessage.error({
                                dangerouslyUseHTMLString: true,
                                message                 : err,
                            })
                        }
                    }
                    resolve(isValid)
                })
            })
        }

        // 对部分表单字段进行校验的方法
        const validateField = (props?: string | string[], alertMessage = false): Promise<boolean> => {
            return new Promise((resolve) => {
                const $elForm = form_ref.value
                if ( !$elForm ) {
                    resolve(false)
                    return
                }

                $elForm.validateField(props, (isValid: boolean, invalidFields: any) => {
                    if (alertMessage && invalidFields) {
                        let err = ''
                        Object.keys(invalidFields).forEach((k) => {
                            invalidFields[k].forEach((f: any) => {
                                err += `<p style="margin-top: ${ err ? '5px' : '' }">${ f.message };</p>`
                            })
                        })
                        if (err) {
                            ElMessage.error({
                                dangerouslyUseHTMLString: true,
                                message                 : err,
                            })
                        }
                    }

                    resolve(isValid)
                })
            })
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


        return {
            form_ref,
            validate,
            validateField,
            resetFields,
            scrollToField,
            clearValidate,
        }
    }
})
</script>

<template>
   <ElForm
        ref="form_ref"
        class="app-form"
        :model="model"
        :labelWidth="labelWidth"
        @submit.prevent="$emit('submit')"
    >
        <template v-for="item in config" :key="item.id">
            <ElFormItem :label="item.name" :prop="item.id" :rules="item.rules">
                <component :is="item.tag" v-model="model[item.id]" v-bind="item.props" />
            </ElFormItem>
        </template>
   </ElForm>
</template>

<style lang="scss">

.app-form .el-form-item:last-child {
    margin-bottom: 0;
}
</style>
