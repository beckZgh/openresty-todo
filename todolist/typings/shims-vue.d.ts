/// <reference types="vite/client" />
/// <reference types="element-plus/global" />
/// <reference types="@sumdoo/types" />

declare module 'v-contextmenu'

declare module 'vue' {
    interface ComponentCustomProperties {
        $utils: typeof Utils
        $api  : typeof window.$api
    }
}

export {}
