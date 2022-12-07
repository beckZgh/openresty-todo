import { defineStore } from 'pinia'
import { reactive, toRefs, ref } from 'vue'

export const useTaskCateStore = defineStore('task-cate', () => {
    const G = window.G || {}

    // 弹窗表单引用
    const form_dialog_ref = ref()

    // 数据
    const state = reactive({
        task_cates            : G.task_cates || [] as $api.$dd_task_cate[], // 任务分类
        curr_contextmenu_item : null as null | $api.$dd_task_cate
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
            const $form_dialog = form_dialog_ref.value
            if ( !$form_dialog ) return resolve({ ok: false })

            $form_dialog.show({
                title : '新建列表分组',
                config: TaskGroupFormConfig,
                submit: async (model: { task_cate_name: string }) => {
                    const res = await $api.dd.task_cate.add({ ...model, task_cate_type: 0 })
                    if (res.ok) state.task_cates.push(res.data)
                    resolve(res)
                    return res.ok
                }
            })
        })
    }

    // 重命名任务列表分组名称
    async function renameTaskCateGroup() {
        const $form_dialog = form_dialog_ref.value
        if ( !$form_dialog ) return

        const item = state.curr_contextmenu_item!
        $form_dialog.show({
            title : '重命名分组列表',
            config: TaskGroupFormConfig,
            model : { task_cate_name: item.task_cate_name },
            submit: async (model: { task_cate_name: string }) => {
                const res = await $api.dd.task_cate.rename({ ...model, task_cate_id: item.task_cate_id})
                if (res.ok) {
                    $utils.arr.replace(state.task_cates, res.data, 'task_cate_id')
                }
                return res.ok
            }
        })
    }

    // 取消任务列表分组
    async function delTaskCateGroup() {
        const confirm = await $utils.showConfirm('是否取消当前分组列表')
        if ( !confirm ) return { ok: false }

        const item = state.curr_contextmenu_item!
        const res  = await $api.dd.task_cate.del({ task_cate_id: item.task_cate_id })
        if ( !res.ok ) return { ok: false }

        $utils.arr.del(state.task_cates, item, 'task_cate_id')

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
        const $form_dialog = form_dialog_ref.value
        if ( !$form_dialog ) return

        const item  = state.curr_contextmenu_item
        const title = '新建列表'
        $form_dialog.show({
            title : item ? `${ title } - ${ item.task_cate_name }` : title,
            config: TaskFormConfig,
            submit: async (model: { task_cate_name: string }) => {
                const res = await $api.dd.task_cate.add({ ...model, task_cate_pid: item?.task_cate_id })
                if (res.ok) {
                    state.task_cates.push(res.data)
                }
                return res.ok
            }
        })
    }

    // 重命名任务列表
    async function renameTaskCate() {
        const $form_dialog = form_dialog_ref.value
        if ( !$form_dialog ) return

        const item = state.curr_contextmenu_item!
        $form_dialog.show({
            title : '重命名列表',
            config: TaskFormConfig,
            model : { task_cate_name: item.task_cate_name },
            submit: async (model: { task_cate_name: string }) => {
                const res = await $api.dd.task_cate.rename({ ...model, task_cate_id: item.task_cate_id})
                if (res.ok) {
                    $utils.arr.replace(state.task_cates, res.data, 'task_cate_id')
                }
                return res.ok
            }
        })
    }

    // 移动任务列表
    async function moveTaskCate(item?: $api.$dd_task_cate) {
        const curr_item = state.curr_contextmenu_item!
        const res = await $api.dd.task_cate.move({
            task_cate_id : curr_item.task_cate_id,
            task_cate_pid: item?.task_cate_id,
        })
        if (!res.ok) return

        $utils.arr.replace(state.task_cates, res.data, 'task_cate_id')
    }

    // 复制任务列表
    function copyTaskCate(item: $api.$dd_task_cate) {
        $utils.showAlert('正在努力开发中...')
    }

    // 删除任务列表
    async function delTaskCate() {
        const confirm = await $utils.showConfirm('是否删除当前列表')
        if ( !confirm ) return

        const item = state.curr_contextmenu_item!
        const res  = await $api.dd.task_cate.del({ task_cate_id: item.task_cate_id })
        if ( !res.ok ) return

        $utils.arr.del(state.task_cates, item, 'task_cate_id')
    }

    // ---------------------------------------------------------------------------

    // 退出清空数据
    function clear() {
        state.task_cates = []
    }

    // 设置当前右键编辑项
    function setCurrContextmenuItem(item: $api.$dd_task_cate) {
        state.curr_contextmenu_item = item
    }

    // 设置表单弹窗引用
    function setFormDialogRef(ref: any) {
        form_dialog_ref.value = ref
    }

    return {
        ...toRefs(state),
        clear,
        setCurrContextmenuItem,
        setFormDialogRef,
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
