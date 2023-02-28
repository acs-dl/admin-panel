<template>
  <div class="module-info-list">
    <div class="module-info-list__header">
      <div class="module-info-list__header-item">
        {{ $t('module-info-list.header') }}
      </div>
    </div>
    <div class="module-info-list__wrapper">
      <module-info-item
        v-for="item in modules"
        :key="item.user_id"
        :id="id"
        :module="item"
      />
    </div>
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
  width: 100%;
  max-width: toRem(365);
}

.module-info-list__header {
  padding: toRem(12) toRem(24);
  display: grid;
  align-items: center;
}

.module-info-list__header-item {
  font-size: toRem(16);
  color: var(--text-primary-light);
}

.module-info-list__wrapper {
  display: flex;
  flex-direction: column;
  padding: toRem(24);
  border-radius: toRem(8);
  background: var(--app-bg);
  align-self: flex-start;
  gap: toRem(15);
}
</style>
