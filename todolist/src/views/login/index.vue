<script lang="ts" setup>
// 背景图片
import LoginBgImg    from './assets/login-bg.svg'
import LoginBoxBgImg from './assets/login-box-bg.svg'

import LoginForm from './login-form.vue'
</script>

<template>
    <div class="login-wrap">
        <div class="login-wrap__bg" :style="{ backgroundImage: `url(${ LoginBgImg })` }" />
        <div class="login-box">
            <div class="login-box__left">
                <img :src="LoginBoxBgImg" width="350">
                <div style="width: 350px; ">
                    <div class="login-box__left-title">
                        欢迎使用 To Do
                    </div>
                    <div class="login-box__left-sub-title">
                        为您的日常任务制定一份含有优先级的待办清单
                    </div>
                </div>
            </div>
            <div class="login-box__right">
                <LoginForm />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &__bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin-left: -48%;
        background-position: 100%;
        background-repeat: no-repeat;
        background-size: auto 100%;
    }

    .login-box {
        position: absolute;
        z-index: 10;
        width: 1200px;
        display: flex;

        &__left,
        &__right {
            flex: 1;
        }

        &__left img {
            margin-bottom: 20px;
        }

        &__right {
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }

        &__left-title {
            font-size: 32px;
            color: var(--white);
        }

        &__left-sub-title {
            margin-top: 15px;
            font-size: 16px;
            color: var(--white);
        }
    }
}
</style>
