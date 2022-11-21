<script setup lang="ts">
import { reactive } from 'vue'

const m = reactive({
    result: ''
})

async function load() {
    const res = await $api.dd.todo.list({ user_id: '' }, { showLoading: true })
    if ( !res.ok ) return

    m.result = JSON.stringify(res)
}
</script>

<template>
    <div>
        <div>
            <ElButton @click="load">发起请求</ElButton>
        </div>

        <div>
            {{ m.result }}
        </div>
    </div>
</template>

<style lang='scss' scoped></style>
