
import { defineStore } from 'pinia'
import { reactive, toRefs, computed } from 'vue'
import { useAppStore } from './app'
import { router      } from '@/router'

export const useTodoStore = defineStore('todo', () => {
    const G        = window.G || {}
    const appStore = useAppStore()

    // 数据
    const state = reactive({
        serach_focus: false,                                      // 搜索框获得焦点
        search_val  : '',                                         // 搜索值
        tasks       : G.tasks      || [] as $api.$dd_todo[]     , // 待办任务列表
        task_cates  : G.task_cates || [] as $api.$dd_todo_cate[], // 任务分类
    })

    // 我的一天
    const myday_list$ = computed(() => state.tasks.filter(item => item.myday === appStore.today$))

    // 重要
    const important_list$ = computed(() => state.tasks.filter(item => item.is_important === 1))

    // 计划内
    const closing_date_list$ = computed(() => state.tasks.filter(item => item.closing_date > '1900-01-01' ))

    // 任务
    const inbox_list$ = computed(() => state.tasks.filter(item => !item.todo_cate_id))

    // 列表
    const cate_list$ = computed(() => {
        const map: Record<string, $api.$dd_todo[]> = {}
        state.tasks.forEach(item => {
            map[item.todo_cate_id] = map[item.todo_cate_id] || []
            map[item.todo_cate_id].push(item)
        })
        return map
    })

    // 统计未完成的数量
    const len$ = computed(() => {
        const map: Record<string, number> = {
            myday       : myday_list$.value.filter(item => item.is_finished === 0).length,
            important   : important_list$.value.filter(item => item.is_finished === 0).length,
            closing_date: closing_date_list$.value.filter(item => item.is_finished === 0).length,
            inbox       : inbox_list$.value.filter(item => item.is_finished === 0).length,
        }

        const cate_list = cate_list$.value
        Object.keys(cate_list).forEach(key => {
            map[key] = cate_list[key].filter(item => item.is_finished === 0).length
        })
        return map
    })

    // 加载数据
    async function refresh() {
        const res = await $api.dd.load({}, { showLoading: true, delay: false })
        if (res) {
            state.tasks      = res.data.tasks
            state.task_cates = res.data.task_cates
        }
        return res
    }

    // 设置搜索是否获得焦点
    function setSearchFocus(focus: boolean) {
        state.serach_focus = focus
    }

    // 添加任务
    async function addTask() {
        const input_value = await $utils.showPrompt('请输入任务名称', '新建任务', {
            inputValidator(value) { // value 默认为 null
                return (value && value.trim()) ? true : '任务名称不能为空'
            }
        })
        if ( !input_value ) return

        const id      = (router.currentRoute.value.params.id || '') as string
        const cate_id = ['myday', 'important', 'closing_date', 'inbox'].includes(id) ? '' : id
        const res = await $api.dd.todo.add({ todo_name: input_value as string, todo_cate_id: cate_id }, { showLoading: true })
        if ( !res.ok ) return

        state.tasks.push(res.data)
    }

    // 修改任务名称
    async function setTaskName(item: $api.$dd_todo) {
        const input_value = await $utils.showPrompt('请输入任务名称', '修改任务', {
            inputValue: item.todo_name,
            inputValidator(value) { // value 默认为 null
                return (value && value.trim()) ? true : '任务名称不能为空'
            }
        })
        if ( !input_value ) return

        const res = await $api.dd.todo.set_name({ todo_id: item.todo_id, todo_name: input_value as string }, { showLoading: true })
        if ( !res.ok ) return

        const idx = state.tasks.findIndex(_ => _.todo_id === item.todo_id)
        if (idx !== -1) state.tasks.splice(idx, 1, res.data)
    }

    // 设置任务是否已完成标识
    async function setTaskIsFinished(id: string, is_finished: number) {
        const res = await $api.dd.todo.set_is_finished({ todo_id: id, is_finished }, { showLoading: true })
        if ( !res.ok ) return

        const idx = state.tasks.findIndex(_ => _.todo_id === id)
        if (idx !== -1) state.tasks.splice(idx, 1, res.data)
    }

    // 设置任务是否重要标识
    async function setTaskImportant(id: string, is_important: number) {
        const res = await $api.dd.todo.set_is_important({ todo_id: id, is_important })
        if ( !res.ok ) return

        const idx = state.tasks.findIndex(_ => _.todo_id === id)
        if (idx !== -1) state.tasks.splice(idx, 1, res.data)
    }

    // 设置任务我的一天标识
    async function setTaskMyday(id: string, myday: string) {
        const res = await $api.dd.todo.set_myday({ todo_id: id, myday })
        if ( !res.ok ) return

        const idx = state.tasks.findIndex(_ => _.todo_id === id)
        if (idx !== -1) state.tasks.splice(idx, 1, res.data)
    }

    // 设置任务截止日期
    async function setTaskClosingDate(id: string, closing_date: string) {
        const res = await $api.dd.todo.set_closing_date({ todo_id: id, closing_date })
        if ( !res.ok ) return

        const idx = state.tasks.findIndex(_ => _.todo_id === id)
        if (idx !== -1) state.tasks.splice(idx, 1, res.data)
    }

    // 删除任务
    async function delTask(item: $api.$dd_todo) {
        const confirm = await $utils.showConfirm('是否删除当前任务')
        if ( !confirm ) return

        const res = await $api.dd.todo.del({ todo_id: item.todo_id })
        if ( !res.ok ) return

        const idx = state.tasks.findIndex(_ => _.todo_id === item.todo_id)
        if (idx !== -1) state.tasks.splice(idx, 1)

        $utils.successMsg('删除成功')
    }

    // 添加任务分类
    async function addTaskCate() {
        const input_value = await $utils.showPrompt('请输入分类标题', '新建列表', {
            inputValidator(value) { // value 默认为 null
                return (value && value.trim()) ? true : '列表不能为空'
            }
        })
        if ( !input_value ) return

        const res = await $api.dd.todo_cate.add({ todo_cate_name: input_value as string }, { showLoading: true })
        if ( !res.ok ) return

        state.task_cates.push(res.data)
    }

    // 修改任务分类
    async function setTaskCate(item: $api.$dd_todo_cate) {
        const input_value = await $utils.showPrompt('请输入分类标题', '修改列表', {
            inputValue: item.todo_cate_name,
            inputValidator(value) { // value 默认为 null
                return (value && value.trim()) ? true : '列表不能为空'
            }
        })
        if ( !input_value ) return

        const res = await $api.dd.todo_cate.set({ todo_cate_id: item.todo_cate_id, todo_cate_name: input_value as string }, { showLoading: true })
        if ( !res.ok ) return

        const idx = state.task_cates.findIndex(_ => _.todo_cate_id === item.todo_cate_id)
        if (idx !== -1) state.task_cates.splice(idx, 1, res.data)
    }

    // 删除任务分类
    async function delTaskCate(item: $api.$dd_todo_cate){
        const confirm = await $utils.showConfirm('是否删除当前任务列表')
        if ( !confirm ) return

        const res = await $api.dd.todo_cate.del({ todo_cate_id: item.todo_cate_id })
        if ( !res.ok ) return

        const idx = state.task_cates.findIndex(_ => _.todo_cate_id === item.todo_cate_id)
        if (idx !== -1) state.task_cates.splice(idx, 1)

        $utils.successMsg('删除成功')
    }

    // 退出清空数据
    function clear() {
        state.serach_focus = false
        state.search_val   = ''
        state.tasks        = []
        state.task_cates   = []
    }

    return {
        ...toRefs(state),
        myday_list$,
        important_list$,
        closing_date_list$,
        inbox_list$,
        cate_list$,
        len$,

        clear,
        refresh,
        setSearchFocus,

        addTaskCate,
        delTaskCate,
        setTaskCate,

        addTask,
        delTask,
        setTaskName,
        setTaskIsFinished,
        setTaskImportant,
        setTaskMyday,
        setTaskClosingDate,
    }
})
