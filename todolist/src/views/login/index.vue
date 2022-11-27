<script lang="ts" setup>
import { useRouter   } from 'vue-router'
import { ref         } from 'vue'
import { useAppStore, useTodoStore } from '@/store'

import AppLogo      from '@/components/AppLogo.vue'
import LoginForm    from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

const appStore     = useAppStore()
const todoStore    = useTodoStore()
const $router      = useRouter()
const redirect_url = ($router.currentRoute.value.query.redirect || '') as string

// 当前表单
const form_ref   = ref()
const curr_form  = ref<'login' | 'register'>('login')
const submitting = ref(false)

// 处理登录
async  function handleLogin(form: { mobile: string; password: string }) {
    submitting.value = true
    const res = await appStore.login(form, redirect_url)
    submitting.value = false
    if ( !res.ok ) return

    todoStore.tasks      = res.data.tasks
    todoStore.task_cates = res.data.task_cates
}

// 处理注册
async function handleRegister(form: { mobile: string; password: string }) {
    submitting.value = true
    const res = await appStore.register(form)
    submitting.value = false
    if ( !res.ok ) return

    form_ref.value && form_ref.value.clearForm()
    curr_form.value = 'login'
}
</script>

<template>
    <div class="container">
        <div class="container-left">
            <img src="@/assets/login-bg.svg" />
        </div>
        <div class="container-right">
            <div class="box-wrap">
                <div class="box-wrap__logo">
                    <AppLogo></AppLogo>
                    <span>OpenResty ToDo</span>
                </div>
                <div class="box-wrap__welcome">
                    欢迎使用 OpenResty ToDo 规划您的待办任务
                </div>
                <div class="nav-scroll-wrap">
                    <div class="nav-wrapper">
                        <div :class="{ 'is-active': curr_form === 'login'    }" @click="curr_form = 'login'">登录</div>
                        <div :class="{ 'is-active': curr_form === 'register' }" @click="curr_form = 'register'">注册</div>
                    </div>
                    <div class="nav-bar" :style="{ left: curr_form === 'login' ? '122px' : '278px' }" />
                </div>
                <component
                    ref="form_ref"
                    :is="curr_form === 'login' ? LoginForm : RegisterForm"
                    :submitting="submitting"
                    @login="handleLogin"
                    @register="handleRegister"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    height: 100%;

    &-left,
    &-right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    &-left  {
        background-color: var(--el-color-primary);

        > img {
            width: 70%;
            display: inline-block;
        }
    }
}

html.dark .container-left {
    background-color: transparent !important;
}

.box-wrap {
    width: 436px;

    &__logo {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
            font-size: 30px;
            font-weight: bold;
            color: var(--el-color-primary);
        }
    }

    &__welcome {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
        font-size: 16px;
        color: var(--text-color-placeholder);
    }

    .nav-scroll-wrap {
        position: relative;
        margin-bottom: 20px;

        .nav-wrapper {
            display: flex;
            justify-content: space-evenly;

            > div {
                cursor: pointer;
                padding: 10px 0;
                font-size: 16px;

                &.is-active {
                    color: var(--el-color-primary);
                }
            }
        }

        .nav-bar {
            position: absolute;
            width: 36px;
            height: 2px;
            background-color: var(--el-color-primary);
            bottom: 0;
            transition: left ease .3s;
        }
    }
}
</style>
