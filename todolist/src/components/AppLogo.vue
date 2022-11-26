<script lang="ts">
import { defineComponent } from 'vue'
import { Box } from '@element-plus/icons-vue'

export default defineComponent({
    name: 'AppLogo',
    props: {
        size: { type: Number, default: 30 }
    },
    components: { Box },
})
</script>

<template>
   <div class="app-logo">
        <ElIcon :size="size" color="#fff"><Box /></ElIcon>
   </div>
</template>

<style lang="scss" scoped>
.app-logo {
    position: relative;
    display: inline-block;
    background-color: var(--primary-color);
    border-radius: 10px 5px 20px 5px;
    padding: 4px 6px;
    margin-right: 10px;
}
</style>

