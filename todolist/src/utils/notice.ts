import type {
    LoadingOptions,
    MessageOptionsWithType,
    ElMessageBoxShortcutMethod,
    ElMessageBoxOptions,
    NotificationOptionsTyped
} from 'element-plus'
import {
    ElLoading,
    ElMessage,
    ElMessageBox,
    ElNotification
} from 'element-plus'
import { isString, isObject } from './shared/is'

/** 显示 Loading */
let $loading: ReturnType<typeof ElLoading.service> | null = null
export function showLoading(options?: LoadingOptions) {
    if ($loading) return $loading

    const opt = options?.fullscreen
        ? options
        : {
                text      : '加载中...',
                background: 'transparent',
                spinner   : `
                    <path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path>
                `,
                svgViewBox : '0 0 1024 1024',
                customClass: 'sd-request-loading',
                ...options,
            }

    $loading = ElLoading.service(opt)

    return $loading
}

/** 显示 隐藏 Loading */
export function hideLoading() {
    $loading && $loading.close()
    $loading = null
}


export const successMsg = CreateMessage('success')
export const warningMsg = CreateMessage('warning')
export const infoMsg    = CreateMessage('info')
export const errorMsg   = CreateMessage('error')

// 创建反馈消息函数
function CreateMessage(type: 'success' | 'warning' | 'info' | 'error') {
    return (options: string | MessageOptionsWithType) => {
        ElMessage[type](typeof options === 'string' ? { message: options } : options)
    }
}

export const successNotice = CreateNotice('success')
export const warningNotice = CreateNotice('warning')
export const infoNotice    = CreateNotice('info')
export const errorNotice   = CreateNotice('error')

function CreateNotice(type: 'success' | 'warning' | 'info' | 'error') {
    return (options: string | NotificationOptionsTyped, title = '通知') => {
        const _options_ = isString(options) ? { message: options } : options

        ElNotification[type]({ ..._options_, title })
    }
}


/** messageBox 确认框等. */
export const showAlert   = createMessageBox<boolean>(ElMessageBox.alert)
export const showConfirm = createMessageBox<boolean>(ElMessageBox.confirm)
export const showPrompt  = createMessageBox<string | boolean>(ElMessageBox.prompt)

// 创建弹窗类函数
function createMessageBox<T>(MessageBoxMethod: ElMessageBoxShortcutMethod) {
    return (
        message: string,
        title?: string,
        options?: ElMessageBoxOptions['type'] | ElMessageBoxOptions,
    ): Promise<T> => {
        return new Promise((resolve) => {
            try {
                title   = title   || '提示'
                message = message || ''

                let type: ElMessageBoxOptions['type'] = 'warning'
                let opt : ElMessageBoxOptions         = {}
                if (isString(options)) {
                    type = options
                    opt  = {}
                } else if (isObject(opt)) {
                    type = opt?.type || 'warning'
                    opt  = options   || {}
                }

                const _options_: ElMessageBoxOptions = {
                    closeOnClickModal: true,
                    confirmButtonText: '确认',
                    cancelButtonText : '取消',
                    ...opt,
                    type,
                }

                MessageBoxMethod(message, title, _options_)
                    .then((res: any) => {
                        const val = res.value
                        resolve(isObject(res) ? val : true)
                    })
                    .catch(() => resolve(false as any))
            } catch (e) {
                resolve(false as any)
            }
        })
    }
}
