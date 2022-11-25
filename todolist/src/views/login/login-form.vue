<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { Iphone, Key, Box    } from '@element-plus/icons-vue'
import { createAesEncryption } from '@/utils/cipher'

// 加密对象
const Aes = createAesEncryption({ key: 'abcdefgabcdefg12' })

export default defineComponent({
    name : 'LoginForm',
    props: {
        submitting: { type: Boolean, default: false }, // 是否提交中
    },
    components: { Box },
    emits: ['login', 'register'],
    setup(_, { emit }) {
        const m = reactive({
            curr_mode: 'login' as 'login' | 'register',
            form: {
                mobile    : '',
                password  : '',
            },
            rules: {
                mobile    : [{ required: true, message: '手机号不能为空', tigger: 'change' }],
                password  : [{ required: true, message: '密码不能为空'  , tigger: 'change' }],
            },
        })

        try {
            m.form.mobile = localStorage.getItem('login_mobile') || ''
        } catch (error) {}

        // 处理登录或注册
        const form_ref = ref()
        async function handleLoginOrRegister() {
            const $form = form_ref.value
            if ( !$form ) return

            // 1) 校验登录表单
            const valid = await $form.validate()
            if ( !valid ) return

            if (m.curr_mode === 'login') {
                emit('login', {
                    mobile  : Aes.encryptByAES(m.form.mobile),
                    password: Aes.encryptByAES(m.form.password)
                })
            } else {
                emit('register', {
                    mobile  : m.form.mobile,
                    password: m.form.password
                })
            }
        }

        return {
            m,
            form_ref,
            handleLoginOrRegister,
            Iphone,
            Key,
        }
    },
})
</script>

<template>
    <div class="form-wrap">
        <div class="form-wrap__logo">
            <ElIcon style="margin-right: 6px;"><Box /></ElIcon>
            ToDo
        </div>
        <div class="form-wrap__title">
            <span :class="{ 'is-active': m.curr_mode === 'login' }" @click="m.curr_mode = 'login'">登录</span>
            <span :class="{ 'is-active': m.curr_mode === 'register' }" @click="m.curr_mode = 'register'">注册</span>
        </div>
        <div class="form-wrap__container">
            <!-- 解决 chrome自动填充 -->
            <div style="width: 0; height: 0; overflow: hidden">
                <input value="account">
                <input type="password" value="password">
            </div>

            <ElForm
                ref="form_ref"
                style="width: 100%"
                :model="m.form"
                :validate-on-rule-change="false"
                @keyup.enter="handleLoginOrRegister"
            >
                <ElFormItem :rules="m.rules.mobile" prop="mobile" class="input-item">
                    <ElInput
                        v-model="m.form.mobile"
                        :prefix-icon="Iphone"
                        clearable
                        size="large"
                        placeholder="请输入手机号"
                    />
                </ElFormItem>
                <ElFormItem :rules="m.rules.password" prop="password" class="input-item">
                    <ElInput
                        v-model="m.form.password"
                        :prefix-icon="Key"
                        type="password"
                        clearable
                        size="large"
                        show-password
                        placeholder="请输入密码"
                    />
                </ElFormItem>
                <ElFormItem style="margin-top: 30px;">
                    <ElButton
                        style="width: 100%; height: 42px;"
                        type="primary"
                        :loading="submitting"
                        @click="handleLoginOrRegister"
                    >
                        <span style="font-size: 18px;">
                            {{ m.curr_mode === 'login' ? '登录' : '注册' }}
                        </span>
                    </ElButton>
                </ElFormItem>
            </ElForm>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.form-wrap {
    width: 436px;
    padding: 0 50px;

    &__logo {
        display: flex;
        justify-content: center;
        color: var(--brand-color);
        font-size: 30px;
        margin-bottom: 40px;
        font-weight: bold;
    }

    &__title {
        display: flex;
        font-size: 22px;
        font-weight: bold;
        margin-bottom: 15px;
        justify-content: space-around;

        span {
            position: relative;
            display: inline-block;
            padding: 0 0 10px;
            cursor: pointer;

            &.is-active {
                color: var(--brand-color);

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: var(--brand-color);
                }
            }
        }
    }
}
</style>
