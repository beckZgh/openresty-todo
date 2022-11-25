<script setup lang="ts">
import { reactive } from 'vue'

const m = reactive({
    todos: [] as $api.$dd_todo[],
    wxdev_login_qrcode: ''
})

load(false)
async function load(refresh: boolean) {
    const res = await $api.dd.todo.list({}, { showLoading: true, delay: refresh ? 0 : 300 })
    if ( !res.ok ) return

    m.todos = res.data
}


</script>

<template>
    <div>
        <div>
            <ElButton @click="load(true)">刷新</ElButton>
        </div>
        <div>
            <ul>
                <template v-for="item in m.todos">
                    <li style="line-height: 2">{{ item.todo_name }}</li>
                </template>
            </ul>
        </div>
    </div>
</template>

<style lang='scss' scoped></style>
