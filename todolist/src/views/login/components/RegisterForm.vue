<script lang="ts">
    import { defineComponent, ref, reactive } from 'vue'
    import { Iphone, Key         } from '@element-plus/icons-vue'

    export default defineComponent({
        name : 'LoginForm',
        props: {
            submitting: { type: Boolean, default: false }, // 是否提交中
        },
        emits: ['register'],
        setup(_, { emit }) {
            const m = reactive({
                form: {
                    user_name : '',
                    mobile    : '',
                    password  : '',
                    confirm_password: '',
                },
                rules: {
                    mobile    : [{ required: true, message: '手机号不能为空', tigger: 'change' }],
                    password  : [{ required: true, message: '密码不能为空'  , tigger: 'change' }],
                    confirm_password: [
                        { validator: validConfirmPassword, tigger: 'change' }
                    ]
                },
            })

            // 处理登录或注册
            const form_ref = ref()
            async function handleSubmit() {
                const $form = form_ref.value
                if ( !$form ) return

                // 1) 校验登录表单
                const valid = await $form.validate()
                if ( !valid ) return

                emit('register', m.form)
            }

            // 校验密码
            function validConfirmPassword(rule: any, value: any, callback: any) {
                if (!value) {
                    callback('确认密码不能为空')
                } else if (value !== m.form.password) {
                    callback('两次密码输入不一致')
                } else {
                    callback()
                }
            }

            // 清空表单
            function clearForm() {
                m.form = {
                    user_name : '',
                    mobile    : '',
                    password  : '',
                    confirm_password: '',
                }
            }

            return {
                m,
                form_ref,
                handleSubmit,
                Iphone,
                Key,
                clearForm
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
            autocomplete="new-password"
            @keyup.enter="handleSubmit"
        >
            <ElFormItem prop="user_name" class="input-item">
                <ElInput
                    v-model="m.form.user_name"
                    :prefix-icon="Iphone"
                    clearable
                    size="large"
                    autocomplete="new-password"
                    placeholder="请输入用户名"
                />
            </ElFormItem>
            <ElFormItem :rules="m.rules.mobile" prop="mobile" class="input-item">
                <ElInput
                    v-model="m.form.mobile"
                    :prefix-icon="Iphone"
                    clearable
                    size="large"
                    autocomplete="new-password"
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
                    autocomplete="new-password"
                    placeholder="请输入密码"
                />
            </ElFormItem>
            <ElFormItem :rules="m.rules.confirm_password" prop="confirm_password" class="input-item">
                <ElInput
                    v-model="m.form.confirm_password"
                    :prefix-icon="Key"
                    type="password"
                    clearable
                    size="large"
                    show-password
                    autocomplete="new-password"
                    placeholder="请再次输入密码"
                />
            </ElFormItem>
            <ElFormItem style="margin-top: 30px;">
                <ElButton
                    style="width: 100%; height: 42px;"
                    type="primary"
                    :loading="submitting"
                    @click="handleSubmit"
                >
                    <span style="font-size: 18px;">
                        注册
                    </span>
                </ElButton>
            </ElFormItem>
        </ElForm>
    </template>
