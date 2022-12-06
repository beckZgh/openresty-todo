<script lang="ts">
import type { PropType } from 'vue'

import { defineComponent, computed } from 'vue'
import { dialogProps, dialogEmits  } from 'element-plus'

export default defineComponent({
    name: 'AppDialog',
    props: {
        ...dialogProps,

        width         : { ...dialogProps.width         , default: 460   }, // 弹窗默认宽度
        draggable     : { ...dialogProps.draggable     , default: true  }, // 可否拖拽
        appendToBody  : { ...dialogProps.appendToBody  , default: true  }, // 距离顶部的位置
        destroyOnClose: { ...dialogProps.destroyOnClose, default: true  }, // 弹窗关闭时，销毁内部元素

        // 内容高度：设置后内容超出指定高度则滚动显示
        height: {
            type   : [String, Number] as PropType<string | number>,
            default: 'auto',
        },

        submitting           : { type: Boolean, default: false  }, // 提交中
        showFooter           : { type: Boolean, default: true   }, // 显示弹窗底部
        showCancelButton     : { type: Boolean, default: true   }, // 显示取消按钮
        disabledCancelButton : { type: Boolean, default: false  }, // 显示取消按钮
        cancelButtonText     : { type: String , default: '取消' }, // 取消按钮文字
        showConfirmButton    : { type: Boolean, default: true   }, // 显示确认按钮
        disabledConfirmButton: { type: Boolean, default: false  }, // 禁用确认按钮
        confirmButtonText    : { type: String , default: '确认' }, // 确认按钮文字
    },
    emits: {
        ...dialogEmits,
        cancel : null,
        confirm: null,
    },
    setup(props, { emit }) {
         // 内部弹窗开关
         const internal_visible = computed({
            get: () => props.modelValue,
            set: (val) => {
                emit('update:modelValue', val)
            },
        })

        // 内容区域滚动样式
        const scrollbarStyle$ = computed(() => {
            let height: string | number = ''
            if (props.fullscreen) {
                height = '100%'
            } else {
                height = $utils.isString(props.height) ? props.height : `${ props.height }px`
            }
            return { height }
        })

        // 是否可关闭抽屉
        const onBeforeClose = (done: (cancel?: boolean) => void) => {
            if ($utils.isFunction(props.beforeClose)) {
                props.beforeClose(done)
            } else {
                done(props.submitting)
            }
        }

        // 点击关闭按钮
        const onClickClose = () => {
            if ($utils.isFunction(props.beforeClose)) {
                props.beforeClose((cancel?: boolean) => {
                    internal_visible.value = cancel ?? false
                })
            } else if (!props.submitting) {
                internal_visible.value = false
            }
        }

        // 点击取消按钮
        const onClickCancel = () => {
            emit('cancel')
            internal_visible.value = false
        }

        // 点击确认按钮
        const onClickConfirm = () => {
            emit('confirm')
        }

        return {
            internal_visible,
            scrollbarStyle$,
            onBeforeClose,
            onClickClose,
            onClickCancel,
            onClickConfirm,
        }
    }
})
</script>

<template>
    <ElDialog
        v-model="internal_visible"
        :width="width"
        :fullscreen="fullscreen"
        :top="top"
        :modal="modal"
        :append-to-body="appendToBody"
        :open-delay="openDelay"
        :close-delay="closeDelay"
        :close-on-click-modal="closeOnClickModal"
        :close-on-press-escape="closeOnPressEscape"
        :show-close="false"
        :before-close="onBeforeClose"
        :draggable="draggable"
        :center="center"
        :destroy-on-close="destroyOnClose"
        class="app-dialog"
        @open="$emit('open')"
        @opened="$emit('opened')"
        @close="$emit('close')"
        @closed="$emit('closed')"
        @open-auto-focus="$emit('openAutoFocus')"
        @close-auto-focus="$emit('closeAutoFocus')"
    >
          <template #header>
            <slot name="header">
                <span class="app-dialog__header-title">{{ title }}</span>
            </slot>
            <div v-if="showClose" class="app-dialog__close-icon" @click="onClickClose">
                <ElIcon :size="18">
                    <Close />
                </ElIcon>
            </div>
        </template>

        <ElScrollbar v-if="fullscreen || height !== 'auto'" :style="scrollbarStyle$">
            <div class="app-dialog__body">
                <slot />
            </div>
        </ElScrollbar>

        <div v-else class="app-dialog__body">
            <slot />
        </div>

        <template v-if="showFooter" #footer>
            <slot name="footer">
                <div v-if="$slots.extra" class="app-dialog__footer-extra">
                    <slot name="extra" />
                </div>
                <ElButton
                    v-if="showCancelButton"
                    :disabled="disabledCancelButton || submitting"
                    @click="onClickCancel"
                >
                    {{ cancelButtonText }}
                </ElButton>
                <ElButton
                    v-if="showConfirmButton"
                    type="primary"
                    :loading="submitting"
                    :disabled="disabledConfirmButton || submitting"
                    @click="onClickConfirm"
                >
                    {{ confirmButtonText }}
                </ElButton>
            </slot>
        </template>
    </ElDialog>
</template>

<style lang="scss">

.app-dialog {
    .el-dialog__header {
        position: relative;
        display: flex;
        align-items: center;
        height: 54px;
        padding: 0 15px;
        margin-right: 0;
        border-bottom: 1px solid var(--el-border-color-lighter);
    }

    &__header-title {
        font-size: 16px;
    }

    .el-dialog__body {
        padding: 0;
    }

    .el-dialog__footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 12px 15px;
        border-top: 1px solid var(--el-border-color-lighter);

        .el-button {
            min-width: 90px;
        }
    }

    &__body {
        padding: 15px;
        box-sizing: border-box;
    }

    &__drag-icon,
    &__close-icon {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:hover {
            background-color: #f6f6f6;
            color: var(--el-color-primary);
        }
    }

    &.el-dialog--center {
        .el-dialog__header,
        .el-dialog__footer  {
            justify-content: center;
        }
    }

    &.is-fullscreen {
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .el-dialog__body {
            flex: 1;
            height: 0;
            overflow: hidden;
        }
    }

    &__footer-extra {
        flex: 1;
        display: flex;
        align-items: center;
    }
}
</style>
