/** 智能导航项 */
interface IntelligenceNavItem {
    icon    : string
    title   : string
    path    : string
    id      : string
    show?   : boolean
    // 深色主题默认展示
    dark_theme: {
        type : 'color' | 'image',
        value: string
    }
    // 浅色主题默认展示
    light_theme   : {
        type : 'color' | 'image',
        value: string
    }
}
