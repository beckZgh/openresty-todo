<script lang="ts">
import type { Axis, ContextMenuItem   } from './types'
import type { CSSProperties, PropType } from 'vue'

import { defineComponent, ref, computed, onMounted, onUnmounted, nextTick, h } from 'vue'
import { ElIcon } from 'element-plus'

const prefix_cls = 'sd-context-menu'

export default defineComponent({
    name : 'SdContextMenu',
    props: {
        width      : { type: Number, default: 156 },
        customEvent: { type: Object as PropType<Event>, default: null },
        styles     : { type: Object as PropType<CSSProperties> },
        showIcon   : { type: Boolean, default: true },
        axis       : { type: Object as PropType<Axis>, default: () => ({ x: 0, y: 0 }) },
        items      : { type: Object as PropType<ContextMenuItem[]>, default: () => ([] as ContextMenuItem[]) },
    },
    setup(props) {
        const wrap_ref = ref(null)
        const show_ref = ref(false)

        const get_style$ = computed(() => {
            const { axis, items, styles, width } = props
            const { x, y } = axis

            const hegiht = (items || []).length * 40
            const body   = document.body
            const left   = body.clientWidth  < x + width  ? x - width  : x
            const top    = body.clientHeight < y + hegiht ? y - hegiht : y

            return {
                ...styles,
                width: `${ width }px`,
                left : `${ left }px`,
                top  : `${ top }px`,
            }
        })

        onMounted(() => {
            nextTick(() => { show_ref.value = true })
        })

        onUnmounted(() => {
            wrap_ref.value && document.body.removeChild(wrap_ref.value)
        })

        // 处理操作
        function handleAction(e: MouseEvent, item: ContextMenuItem) {
            if (item.disabled) return

            show_ref.value = false

            e?.stopPropagation()
            e?.preventDefault()

            item.handle && item.handle()
        }

        // 渲染菜单项
        function renderMenuItems(items: ContextMenuItem[]) {
            return items.map((item) => {
                return h('li', {
                    disabled: item.disabled,
                    class   : `${ prefix_cls }__item ${ item.disabled ? 'is-disabled' : '' }`,
                    onClick : (e: MouseEvent) => handleAction(e, item),
                }, {
                    default: () => {
                        if (item.icon) {
                            return [
                                h(ElIcon, h(item.icon as string)),
                                h('span', { style: 'margin-left: 8px' }, item.label),
                            ]
                        } else {
                            return item.label
                        }
                    },
                })
            })
        }

        return () => {
            if (!show_ref.value) return null

            return h('ul', {
                style: get_style$.value,
                class: prefix_cls,
            }, renderMenuItems(props.items))
        }
    },
})
</script>

<style lang="scss">
.sd-context-menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: block;
    width: 156px;
    margin: 0;
    list-style: none;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 40px 10px rgb(0 0 0 / 10%);
    background-clip: padding-box;
    user-select: none;
    padding: 12px 0;

    &__item {
        display: flex;
        align-items: center;
        padding: 8px 15px;
        box-sizing: border-box;
        cursor: pointer;
        transition: all .3s ease;

        &:hover {
            background-color: var(--el-color-primary);
            color: var(--el-color-white);
        }
    }
}
</style>
