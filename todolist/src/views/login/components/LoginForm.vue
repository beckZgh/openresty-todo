<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { Iphone, Key         } from '@element-plus/icons-vue'
import { createAesEncryption } from '@/utils/cipher'

// 加密对象
const Aes = createAesEncryption({ key: 'abcdefgabcdefg12' })

export default defineComponent({
    name : 'LoginForm',
    props: {
        submitting: { type: Boolean, default: false }, // 是否提交中
    },
    emits: ['login'],
    setup(_, { emit }) {
        const m = reactive({
            form: {
                email    : '',
                password : '',
            },
            rules: {
                email   : [{ required: true, message: '邮箱不能为空', tigger: 'change' }],
                password: [{ required: true, message: '密码不能为空'  , tigger: 'change' }],
            },
        })

        try {
            m.form.email = localStorage.getItem('login_email') || ''
        } catch (error) {}

        // 处理登录或注册
        const form_ref = ref()
        async function handleSubmit() {
            const $form = form_ref.value
            if ( !$form ) return

            // 1) 校验登录表单
            const valid = await $form.validate()
            if ( !valid ) return

            emit('login', {
                email   : Aes.encryptByAES(m.form.email),
                password: Aes.encryptByAES(m.form.password)
            })
        }

        // 开发中提示
        function handleDoingTip() {
            $utils.showAlert('功能正在火速开发中...')
        }

        // 清空表单
        function clearForm() {
            m.form = {
                email    : '',
                password  : '',
            }
        }

        return {
            m,
            form_ref,
            handleSubmit,
            handleDoingTip,
            clearForm,
            Iphone,
            Key,
        }
    },
})
</script>

<template>
    <ElForm
        ref="form_ref"
        style="width: 100%"
        :model="m.form"
        :validate-on-rule-change="false"
        autocomplete="off"
        @keyup.enter="handleSubmit"
    >
        <ElFormItem :rules="m.rules.email" prop="email" class="input-item">
            <ElInput
                v-model="m.form.email"
                clearable
                size="large"
                autocomplete="new-password"
                placeholder="请输入邮箱"
            />
        </ElFormItem>
        <ElFormItem :rules="m.rules.password" prop="password" class="input-item">
            <ElInput
                v-model="m.form.password"
                type="password"
                clearable
                size="large"
                show-password
                autocomplete="new-password"
                placeholder="请输入密码"
            />
        </ElFormItem>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <ElCheckbox>
                <span style="position: relative; top: 1px;">
                    记住我
                </span>
            </ElCheckbox>
            <ElLink type="primary" @click="handleDoingTip">忘记密码</ElLink>
        </div>
        <ElFormItem style="margin-top: 12px;">
            <ElButton
                style="width: 100%; height: 42px;"
                type="primary"
                :loading="submitting"
                @click="handleSubmit"
            >
                <span style="font-size: 18px;">
                    登录
                </span>
            </ElButton>
        </ElFormItem>
        <div style="display: flex; align-items: center;">
            <span>其他登录方式:</span>
            <i class="other-login-icon" @click="handleDoingTip">
                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M19.1833 45.4716C18.9898 45.2219 18.9898 42.9973 19.1833 38.798C17.1114 38.8696 15.8024 38.7258 15.2563 38.3667C14.437 37.828 13.6169 36.1667 12.8891 34.9959C12.1614 33.8251 10.5463 33.64 9.89405 33.3783C9.24182 33.1165 9.07809 32.0496 11.6913 32.8565C14.3044 33.6634 14.4319 35.8607 15.2563 36.3745C16.0806 36.8883 18.0515 36.6635 18.9448 36.2519C19.8382 35.8403 19.7724 34.3078 19.9317 33.7007C20.1331 33.134 19.4233 33.0083 19.4077 33.0037C18.5355 33.0037 13.9539 32.0073 12.6955 27.5706C11.437 23.134 13.0581 20.2341 13.9229 18.9875C14.4995 18.1564 14.4485 16.3852 13.7699 13.6737C16.2335 13.3589 18.1347 14.1343 19.4734 16.0001C19.4747 16.0108 21.2285 14.9572 24.0003 14.9572C26.772 14.9572 27.7553 15.8154 28.5142 16.0001C29.2731 16.1848 29.88 12.7341 34.5668 13.6737C33.5883 15.5969 32.7689 18.0001 33.3943 18.9875C34.0198 19.9749 36.4745 23.1147 34.9666 27.5706C33.9614 30.5413 31.9853 32.3523 29.0384 33.0037C28.7005 33.1115 28.5315 33.2855 28.5315 33.5255C28.5315 33.8856 28.9884 33.9249 29.6465 35.6117C30.0853 36.7362 30.117 39.948 29.7416 45.247C28.7906 45.4891 28.0508 45.6516 27.5221 45.7347C26.5847 45.882 25.5669 45.9646 24.5669 45.9965C23.5669 46.0284 23.2196 46.0248 21.837 45.8961C20.9154 45.8103 20.0308 45.6688 19.1833 45.4716Z" fill="currentColor"/></svg>
            </i>
        </div>
    </ElForm>
</template>

<style lang="scss" scoped>
.other-login-icon {
    display: inline-block;
    color: var(--primary-color);
    margin-left: 15px;
    cursor: pointer;
}
</style>
