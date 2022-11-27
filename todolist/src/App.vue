<script setup lang="ts">
import { useAppStore } from '@/store'
useAppStore().initTheme()
</script>

<template>
    <RouterView />
</template>
