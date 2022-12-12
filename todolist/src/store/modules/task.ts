
import { defineStore      } from 'pinia'
import { useAppStore      } from './app'
import { useTaskCateStore } from './task-cate'
import { router           } from '@/router'
import { reactive, toRefs, computed, markRaw } from 'vue'

const DEFAULT_DATE = '1900-01-01'
export const useTaskStore = defineStore('task', () => {
    const G        = window.G || {}
    const appStore = useAppStore()

    // 数据
    const m = reactive({
        serach_focus    : false                           , // 搜索框获得焦点
        search_val      : ''                              , // 搜索值
        tasks           : G.tasks || [] as $api.$dd_task[], // 待办任务列表
        curr_edit_item  : null as null | $api.$dd_task    , // 当前编辑项
        contextmenu_ref : null as any                     , // 右键菜单引用
    })

    // 任务分类
    const task$ = computed((): Record<string, $api.$dd_task[]> => {
        const myday_list        = [] as $api.$dd_task[] // 我的一天
        const important_list    = [] as $api.$dd_task[] // 重要
        const closing_date_list = [] as $api.$dd_task[] // 计划内
        const inbox_list        = [] as $api.$dd_task[] // 任务
        const custom_cate_list  = {} as Record<string,  $api.$dd_task[]>

        m.tasks.forEach(item => {
            // 我的一天
            if (item.myday === appStore.today$) myday_list.push(item)

            // 重要
            if (item.is_important === 1) important_list.push(item)

            // 计划内
            if (item.closing_date > DEFAULT_DATE) closing_date_list.push(item)

            // 自定义列表
            if (item.task_cate_id) {
                custom_cate_list[item.task_cate_id] = custom_cate_list[item.task_cate_id] || []
                custom_cate_list[item.task_cate_id].push(item)
            } else {
                inbox_list.push(item)
            }
        })

        return {
            myday       : myday_list,
            important   : important_list,
            closing_date: closing_date_list,
            inbox       : inbox_list,
            ...custom_cate_list
        }
    })

    // ---------------------------------------------------------------------------

    // 添加任务
    async function addTask(task_name: string) {
        const id      = (router.currentRoute.value.params.id || '') as string
        const cate_id = appStore.nav_ids.includes(id) ? '' : id
        const res = await $api.dd.task.add({ task_name: task_name, task_cate_id: cate_id }, { showLoading: true })
        if (res.ok) {
            m.tasks.push(res.data)
        }
        return res
    }

    // 修改任务名称
    async function setTaskName(item: $api.$dd_task) {
        const input_value = await $utils.showPrompt('请输入任务名称', '修改任务', {
            inputValue: item.task_name,
            inputValidator(value) { // value 默认为 null
                return (value && value.trim()) ? true : '任务名称不能为空'
            }
        })
        if ( !input_value ) return

        const res = await $api.dd.task.set_name({ task_id: item.task_id, task_name: input_value as string }, { showLoading: true })
        if ( !res.ok ) return

        const idx = m.tasks.findIndex(_ => _.task_id === item.task_id)
        if (idx !== -1) m.tasks.splice(idx, 1, res.data)
    }

    // 设置任务是否已完成标识
    async function setTaskIsFinished(item: $api.$dd_task) {
        const task_id     = item.task_id
        const is_finished = item.is_finished === 1 ? 0 : 1
        const res = await $api.dd.task.set_is_finished({ task_id, is_finished }, { showLoading: true })
        if (res.ok) {
            $utils.arr.replace(m.tasks, res.data, 'task_id')
        }
        return res
    }

    // 设置任务是否重要标识
    async function setTaskImportant(item: $api.$dd_task) {
        const task_id      = item.task_id
        const is_important = item.is_important === 1 ? 0 : 1
        const res = await $api.dd.task.set_is_important({ task_id, is_important })
        if (res.ok) {
            $utils.arr.replace(m.tasks, res.data, 'task_id')
        }
        return res
    }

    // 设置任务我的一天标识
    async function setTaskMyday(item: $api.$dd_task) {
        const task_id = item.task_id
        const myday   = item.myday !== DEFAULT_DATE ? DEFAULT_DATE : appStore.server_date
        const res = await $api.dd.task.set_myday({ task_id, myday })
        if (res.ok) {
            $utils.arr.replace(m.tasks, res.data, 'task_id')
        }
        return res
    }

    // 设置任务截止日期
    async function setTaskClosingDate(item: $api.$dd_task, closing_date: string = '') {
        if (closing_date === 'today'   ) closing_date = appStore.server_date
        if (closing_date === 'tomorrow') closing_date = $utils.dt.nextDate(appStore.server_time)
        if (closing_date === 'delete'  ) closing_date = DEFAULT_DATE

        const res = await $api.dd.task.set_closing_date({ task_id: item.task_id, closing_date })
        if (res.ok) {
            $utils.arr.replace(m.tasks, res.data, 'task_id')
        }
        return res
    }

    // 删除任务
    async function delTask(item: $api.$dd_task) {
        const confirm = await $utils.showConfirm('是否删除当前任务')
        if ( !confirm ) return

        const res = await $api.dd.task.del({ task_id: item.task_id })
        if ( !res.ok ) return

        const idx = m.tasks.findIndex(_ => _.task_id === item.task_id)
        if (idx !== -1) m.tasks.splice(idx, 1)
    }

    // ---------------------------------------------------------------------------

    // 设置搜索是否获得焦点
    function setSearchFocus(focus: boolean) {
        m.serach_focus = focus
    }

     // 退出清空数据
     function clear() {
        m.serach_focus = false
        m.search_val   = ''
        m.tasks        = []
    }

    // 设置当前右键编辑项
    function setCurrEditItem(item: $api.$dd_task | null) {
        useTaskCateStore().hideContextmenu()
        m.curr_edit_item = item
    }

    // 设置右键菜单引用
    function setContextmenuRef(ref: any) {
        m.contextmenu_ref = markRaw(ref) // 标记不进行 proxy 代理
    }

    // 隐藏右键菜单
    function hideContextmenu() {
        m.contextmenu_ref && m.contextmenu_ref.hide()
    }


    return {
        ...toRefs(m),
        task$,
        clear,
        setSearchFocus,
        setCurrEditItem,
        setContextmenuRef,
        hideContextmenu,
        // ----------------------
        addTask,
        delTask,
        setTaskName,
        setTaskIsFinished,
        setTaskImportant,
        setTaskMyday,
        setTaskClosingDate,
    }
})
