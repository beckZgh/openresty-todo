import { defineStore } from 'pinia'
import { reactive, toRefs, markRaw } from 'vue'
import { useTaskStore } from './task'

export const useTaskCateStore = defineStore('task-cate', () => {
    const G = window.G || {}

    // 数据
    const m = reactive({
        task_cates      : G.task_cates || [] as $api.$dd_task_cate[], // 任务分类
        curr_edit_item  : null as null | $api.$dd_task_cate         , // 当前编辑项
        form_dialog_ref : null as any                               , // 表单弹窗引用
        contextmenu_ref : null as any                               , // 列表右键菜单引用
    })

    // ---------------------------------------------------------------------------
    // 任务列表分组
    const TaskGroupFormConfig =  [
        {
            id   : 'task_cate_name', name: '列表分组名称', tag: 'ElInput',
            props: { placeholder: '请输入列表分组名称', autofocus: true },
            rules: [{ required: true, message: '列表分组不能为空' }]
        }
    ]
    // 添加任务列表分组
    function addTaskCateGroup(): Promise<{ ok: boolean; err?: string; data?: $api.$dd_task_cate }> {
        return new Promise((resolve) => {
            const $form_dialog = m.form_dialog_ref
            if ( !$form_dialog ) return resolve({ ok: false })

            $form_dialog.show({
                title : '新建列表分组',
                config: TaskGroupFormConfig,
                submit: async (model: { task_cate_name: string }) => {
                    const res = await $api.dd.task_cate.add({ ...model, task_cate_type: 0 })
                    if (res.ok) m.task_cates.push(res.data)
                    resolve(res)
                    return res.ok
                }
            })
        })
    }

    // 重命名任务列表分组名称
    async function renameTaskCateGroup() {
        const $form_dialog = m.form_dialog_ref
        if ( !$form_dialog ) return

        const item = m.curr_edit_item!
        $form_dialog.show({
            title : '重命名分组列表',
            config: TaskGroupFormConfig,
            model : { task_cate_name: item.task_cate_name },
            submit: async (model: { task_cate_name: string }) => {
                const res = await $api.dd.task_cate.rename({ ...model, task_cate_id: item.task_cate_id})
                if (res.ok) {
                    $utils.arr.replace(m.task_cates, res.data, 'task_cate_id')
                }
                return res.ok
            }
        })
    }

    // 取消任务列表分组
    async function delTaskCateGroup() {
        const confirm = await $utils.showConfirm('是否取消当前分组列表')
        if ( !confirm ) return { ok: false }

        const item = m.curr_edit_item!
        const res  = await $api.dd.task_cate.del({ task_cate_id: item.task_cate_id })
        if ( !res.ok ) return { ok: false }

        $utils.arr.del(m.task_cates, item, 'task_cate_id')

        return res
    }

    // ---------------------------------------------------------------------------

    // ---------------------------------------------------------------------------
    // 任务列表

    const TaskFormConfig =  [
        {
            id   : 'task_cate_name', name: '列表名称', tag: 'ElInput',
            props: { placeholder: '请输入列表名称', autofocus: true },
            rules: [{ required: true, message: '列表名称不能为空' }]
        }
    ]
    // 添加任务列表
    async function addTaskCate() {
        const $form_dialog = m.form_dialog_ref
        if ( !$form_dialog ) return

        const item  = m.curr_edit_item
        const title = '新建列表'
        $form_dialog.show({
            title : item ? `${ title } - ${ item.task_cate_name }` : title,
            config: TaskFormConfig,
            submit: async (model: { task_cate_name: string }) => {
                const res = await $api.dd.task_cate.add({ ...model, task_cate_pid: item?.task_cate_id })
                if (res.ok) {
                    m.task_cates.push(res.data)
                }
                return res.ok
            }
        })
    }

    // 重命名任务列表
    async function renameTaskCate() {
        const $form_dialog = m.form_dialog_ref
        if ( !$form_dialog ) return

        const item = m.curr_edit_item!
        $form_dialog.show({
            title : '重命名列表',
            config: TaskFormConfig,
            model : { task_cate_name: item.task_cate_name },
            submit: async (model: { task_cate_name: string }) => {
                const res = await $api.dd.task_cate.rename({ ...model, task_cate_id: item.task_cate_id})
                if (res.ok) {
                    $utils.arr.replace(m.task_cates, res.data, 'task_cate_id')
                }
                return res.ok
            }
        })
    }

    // 移动任务列表
    async function moveTaskCate(item?: $api.$dd_task_cate) {
        const curr_item = m.curr_edit_item!
        const res = await $api.dd.task_cate.move({
            task_cate_id : curr_item.task_cate_id,
            task_cate_pid: item?.task_cate_id,
        })
        if (!res.ok) return

        $utils.arr.replace(m.task_cates, res.data, 'task_cate_id')
    }

    // 复制任务列表
    function copyTaskCate(item: $api.$dd_task_cate) {
        $utils.showAlert('正在努力开发中...')
    }

    // 删除任务列表
    async function delTaskCate() {
        const confirm = await $utils.showConfirm('是否删除当前列表')
        if ( !confirm ) return { ok: false }

        const item = m.curr_edit_item!
        const res  = await $api.dd.task_cate.del({ task_cate_id: item.task_cate_id })
        if ( !res.ok ) return { ok: false }

        $utils.arr.del(m.task_cates, item, 'task_cate_id')

        return res
    }

    // ---------------------------------------------------------------------------

    // 退出清空数据
    function clear() {
        m.curr_edit_item = null
        m.task_cates     = []
    }

    // 设置当前右键编辑项
    function setCurrEditItem(item: $api.$dd_task_cate | null) {
        useTaskStore().hideContextmenu()
        m.curr_edit_item = item
    }

    // 设置表单弹窗引用
    function setFormDialogRef(ref: any) {
        m.form_dialog_ref = markRaw(ref) // 标记不进行 proxy 代理
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
        clear,
        setCurrEditItem,
        setFormDialogRef,
        setContextmenuRef,
        hideContextmenu,
        // ----------------------
        addTaskCateGroup,
        renameTaskCateGroup,
        delTaskCateGroup,
        // ----------------------
        addTaskCate,
        renameTaskCate,
        moveTaskCate,
        copyTaskCate,
        delTaskCate,
        // ----------------------
    }
})
