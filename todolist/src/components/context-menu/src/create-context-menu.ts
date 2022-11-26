import type { ContextMenuProps, CreateContextOptions } from './types'

import ContextMenu from './context-menu.vue'
import { createVNode, render } from 'vue'

// 右键菜单管理
const contextMenuManger = {
    dom_list: [] as Element[],
    resolve : (() => ({})) as Function,
}

// 创建右键菜单
export const createContextMenu = (options: CreateContextOptions) => {
    const event = options.event
    event && event.preventDefault()

    return new Promise((resolve) => {
        // 构造组件属性
        const props_data = {} as Partial<ContextMenuProps>
        if (options.styles) props_data.styles = options.styles
        if (options.items ) props_data.items = options.items
        if (options.event ) {
            props_data.customEvent = options.event
            props_data.axis = { x: event.clientX, y: event.clientY }
        }

        // 创建右键菜单虚拟 DOM，并渲染到指定容器
        const container = document.createElement('div')
        const vm        = createVNode(ContextMenu, props_data)
        render(vm, container)

        // 保存创建的右键菜单、用于自动清除
        contextMenuManger.dom_list.push(container)
        contextMenuManger.resolve = (arg: string) => {
            remove()
            resolve(arg)
        }

        // 处理右键菜单迪点击
        function handleClick() {
            contextMenuManger.resolve('')
        }

        // 从 DOM 中移除
        function remove() {
            contextMenuManger.dom_list.forEach((dom: Element) => {
                try {
                    dom && document.body.removeChild(dom)
                } catch (error) {}
            })

            document.body.removeEventListener('click', handleClick)
            document.body.removeEventListener('scroll', handleClick)
        }

        remove()
        document.body.appendChild(container)
        document.body.addEventListener('click' , handleClick)
        document.body.addEventListener('scroll', handleClick)
    })
}

// 销毁所有右键菜单
export function destoryContextMenu() {
    if (contextMenuManger) {
        contextMenuManger.resolve('')
        contextMenuManger.dom_list = []
    }
}
