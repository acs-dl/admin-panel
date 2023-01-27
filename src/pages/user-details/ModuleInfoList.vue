<template>
  <div class="module-info-list">
    <module-info-item
      v-for="item in modules"
      :key="item.user_id"
      :id="id"
      :module="item"
    />
  </div>
</template>

<script lang="ts" setup>
import { ModuleInfo } from '@/types'
import ModuleInfoItem from './ModuleInfoItem.vue'

defineProps<{
  id: string
  modules: ModuleInfo[]
}>()
</script>

<style scoped lang="scss">
.module-info-list {
  display: flex;
  flex-direction: column;
  padding: toRem(24);
  border-radius: toRem(8);
  width: 100%;
  max-width: toRem(365);
  background: var(--app-bg);
}
</style>
