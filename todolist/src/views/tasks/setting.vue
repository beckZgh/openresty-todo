<script setup lang="ts">
import { useAppStore } from '@/store'
const appStore = useAppStore()
</script>

<template>
    <div class="container">
        <div class="container-inner">
            <div class="user-info">
                <div class="user-info-left">
                    <ElAvatar :size="60" >
                        <img src="@/assets/user-avtar.jpg" />
                    </ElAvatar>
                    <div>
                        <div class="user-info__name">{{ appStore.user?.user_name || '' }}</div>
                        <div class="user-info__mobile">{{ appStore.user?.email   || '' }}</div>
                    </div>
                </div>
                <ElButton>退出登录</ElButton>
            </div>
            <ElDivider />
            <div class="title">主题</div>
            <ElRadioGroup v-model="appStore.setting.theme" style="display: block;">
                <div><ElRadio label="light">浅色主题</ElRadio></div>
                <div><ElRadio label="dark">深色主题</ElRadio></div>
            </ElRadioGroup>
            <ElDivider />
            <div class="title">智能列表</div>
            <div class="switch-item">
                <span>重要</span>
                <ElSwitch v-model="appStore.setting.enable_important" />
            </div>
            <div class="switch-item">
                <span>计划内</span>
                <ElSwitch v-model="appStore.setting.enable_closing_date" />
            </div>
            <div class="switch-item">
                <span>已完成</span>
                <ElSwitch v-model="appStore.setting.enable_finished" />
            </div>
            <div class="switch-item">
                <span>全部</span>
                <ElSwitch v-model="appStore.setting.enable_all" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.container {
    padding: 50px 0;
    box-sizing: border-box;
    border-radius: 10px 0 0 0 ;

    &-inner {
        width: 600px;
        margin: 0 auto;
    }

    .user-info {
        display: flex;
        align-items: center;
        padding: 50px 0 30px;

        &-left {
            flex: 1;
            display: flex;
            align-items: center;

            :deep(.el-avatar) {
                margin-right: 10px;
            }
        }

        &__name {
            font-size: 26px;
            margin-bottom: 5px;
        }

        &__mobile {
            font-size: 14px;
            color: var(--text-color-secondary);
        }
    }

    :deep(.el-divider) {
        margin-bottom: 30px;
    }

    .title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .switch-item {
        display: flex;
        justify-content: space-between;

        > span {
            font-size: 16px;
            font-weight: bold;
        }
    }

    .switch-item + .switch-item {
        margin-top: 10px;
    }
}
</style>
