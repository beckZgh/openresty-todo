import { defineStore } from 'pinia'
import { reactive, toRefs, computed, ref } from 'vue'

type TaskCateNav = $api.$dd_task_cate & { children?: $api.$dd_task_cate[] }

export const useTaskCateStore = defineStore('task-cate', () => {
    const G = window.G || {}

    // 弹窗表单引用
    const form_dialog_ref = ref()

    // 数据
    const state = reactive({
        task_cates            : G.task_cates || [] as $api.$dd_task_cate[], // 任务分类
        curr_contextmenu_item : null as null | $api.$dd_task_cate
    })

    // 任务列表导航
    const task_cate_navs$ = computed(() => {
        const map = new Map<string, TaskCateNav>()
        const arr = [] as TaskCateNav[]
        state.task_cates.forEach(item => {
            if (item.task_cate_pid === '') {
                const o = { ...item, children: [] }
                map.set(o.task_cate_pid, o)
                arr.push(o)
            } else {
                const children = map.get(item.task_cate_pid)?.children
                children && children.push(item)
            }
        })
        return arr
    })

    // ---------------------------------------------------------------------------
    // 任务列表分组

    // 添加任务列表分组
    function addTaskCateGroup() {}

    // 重命名任务列表分组名称
    function renameTaskCateGroup() {}

    // 取消任务列表分组
    function delTaskCateGroup() {}

    // ---------------------------------------------------------------------------

    // ---------------------------------------------------------------------------
    // 任务列表

    const TaskFormConfig =  [
        {
            id   : 'task_cate_name', name: '任务名称', tag: 'ElInput',
            props: { placeholder: '请输入任务名称' },
            rules: [{ required: true, message: '任务名称不能为空' }]
        }
    ]
    // 添加任务列表
    async function addTaskCate() {
        const $form_dialog = form_dialog_ref.value
        if ( !$form_dialog ) return

        $form_dialog.show({
            title : '新建列表',
            config: TaskFormConfig,
            submit: async (model: { task_cate_name: string }) => {
                const res = await $api.dd.task_cate.add(model)
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
    function moveTaskCate() {}

    // 复制任务列表
    function copyTaskCate() {}

    // 删除任务列表
    async function delTaskCate() {
        const confirm = await $utils.showConfirm('是否删除当前项')
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

    // 右键菜单指令
    function handleTaskCateContextmenu(command: 'rename' | 'move' | 'copy' | 'remove') {
        const item = state.curr_contextmenu_item
        if ( !item ) return

        switch(command) {
            case 'rename': return renameTaskCate()
            case 'move'  : return moveTaskCate()
            case 'copy'  : return copyTaskCate()
            case 'remove': return delTaskCate()
        }
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
        task_cate_navs$,
        clear,
        handleTaskCateContextmenu,
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
