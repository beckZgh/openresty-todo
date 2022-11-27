import { useRouter     } from 'vue-router'
import { useAppStore   } from '@/store'
import { Http as Axios } from '@/utils/axios'

export default function () {
    return Axios.create({
        baseURL: process.env.NODE_ENV === 'production' ? $utils.getHost() : '',
        timeout: 60 * 1000, // 60秒超时
        headers: {
            'Cache-Control': 'no-cache', // 禁止缓存
        },

        showLoading  : false,
        showError    : true,
        onShowLoading: $utils.showLoading,
        onHideLoading: $utils.hideLoading,
        onShowError(msg, config) {
            if (config.showErrorMode === 'alert') {
                $utils.showAlert(msg)
            } else {
                $utils.errorMsg(msg)
            }
        },

        // 请求前拦截
        requestInterceptor(config) {
            // 用户编码
            const user_id = useAppStore().user?.user_id

            // 补充请求字段
            if (Object.prototype.toString.call(config.data) === '[object FormData]') {
                if (!config.data.has('user_id')) config.data.append('user_id', user_id)
            } else if (!config.data.user_id) {
                config.data.user_id = user_id
            }

            return config
        },

        // 请求后拦截
        responseInterceptor(response) {
            // 更新服务器时间
            useAppStore().updateDateWithTime(response.data as any)

            return response
        },

        // 状态码处理
        responseStatusInterceptor(status, res) {
            const d   = res.data || {}
            const err = d.err || d.msg || d.message
            if (err === '用户尚未登录') status = 401

            switch (status) {
                case 401:
                case 403: {
                    const $router = useRouter()
                    $router.replace({ path: '/login', query: { redirect: $router.currentRoute.value.fullPath } })
                    return status === 401 ? '尚未登录' : '登录超时，需要重新登录!'
                }
                case 404: return '请求资源不存在'
                case 500: return '内部错误，请稍后重试！'
                case 502: return '服务器无响应，请稍后重新！'
                case 503: return '服务器正在维护，请稍后重试！'
                default : return ''
            }
        },
    })
}
