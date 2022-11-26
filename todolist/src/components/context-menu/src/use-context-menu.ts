
import { getCurrentInstance ,onUnmounted } from 'vue'
import { createContextMenu, destoryContextMenu } from './create-context-menu'

/** 使用右键菜单 */
export function useContextMenu(auto_remove = true) {
    if (getCurrentInstance() && auto_remove) {
        onUnmounted(() => {
            destoryContextMenu()
        })
    }
    return { createContextMenu, destoryContextMenu }
}
