<template>
  <div class="admin-panel">
    <div class="admin-panel__sidebar-wrapper">
      <app-sidebar class="admin-panel__sidebar" />
    </div>
    <router-view class="admin-panel__inner" />
    <app-button
      class="admin-panel__status-button"
      modification="border-rounded"
      size="small"
      :text="$t('admin-panel.status-button')"
      :icon-left="$icons.viewFilledGridAdd"
      @click="openStatusModal"
    />
    <status-modal v-model:is-shown="isStatusModalOpened" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppSidebar, AppButton, StatusModal } from '@/common'
import { usePlatformStore } from '@/store'

const { getAllPositions, getAllModules } = usePlatformStore()
const isStatusModalOpened = ref(false)

const init = async () => {
  await Promise.allSettled([getAllPositions(), getAllModules()])
}

const openStatusModal = () => {
  isStatusModalOpened.value = true
}

init()
</script>

<style scoped lang="scss">
.admin-panel {
  padding: 0;
  display: flex;
  min-width: 100vh;
  min-height: 100vh;
  position: relative;
}

.admin-panel__sidebar-wrapper {
  width: 100%;
  max-width: toRem(300);
  height: 100vh;
  background: var(--app-bg-tertiary);
}

.admin-panel__sidebar {
  max-width: toRem(300);
  position: fixed;
}

.admin-panel__inner {
  width: 100%;
  padding: toRem(35) toRem(40) toRem(20);
  overflow-y: scroll;
  background: var(--background-primary-dark);
}

.admin-panel__status-button {
  position: absolute;
  bottom: toRem(20);
  right: toRem(40);
  gap: toRem(8);
  height: toRem(45);
  background: var(--background-secondary-main);
  box-shadow: var(--shadow-secondary);
  transition: 0.2s ease-in-out;

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    opacity: 0.8;
    background: var(--background-secondary-main);
    box-shadow: var(--shadow-secondary);
  }
}
</style>
