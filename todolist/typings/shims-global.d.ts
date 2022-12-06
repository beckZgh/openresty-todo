import type { AppRouteConfig } from '~/types'

import type { App    } from 'vue'
import type { Router } from 'vue-router'
import type { Pinia  } from 'pinia'

import Utils from '../src/utils'


declare global {
    /** 工具方法 */
    const $utils = Utils

    /** 后端注入全局 G 数据 */
    interface Window {
        $utils : Utils
        $app   : App
        $store : Pinia
        $router: Router

        G      : {
            server_date: string
            server_time: numbeer
            user       : $api.$pv_user
            tasks      : $api.$dd_todo[]
            task_cates : $api.$dd_task_cate[]
        }
    }
}
