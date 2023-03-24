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
    <transition-modal>
      <status-modal
        v-if="isStatusModalOpened"
        @close="closeStatusModal"
      />
    </transition-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppSidebar, AppButton, StatusModal, TransitionModal } from '@/common'
import { useAuthStore, usePlatformStore } from '@/store'
import { ErrorHandler } from '@/helpers'

const { logout } = useAuthStore()
const { getAllPositions, getAllModules, getAllRoles } = usePlatformStore()
const isStatusModalOpened = ref(false)

const init = async () => {
  try {
    await Promise.all([getAllPositions(), getAllModules(), getAllRoles()])
  } catch (e) {
    logout()
    ErrorHandler.process(e)
  }
}

const openStatusModal = () => {
  isStatusModalOpened.value = true
}

const closeStatusModal = () => {
  isStatusModalOpened.value = false
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
  padding: toRem(35) toRem(40) toRem(38);
  overflow-y: scroll;
  background: var(--background-primary-dark);
}

.admin-panel__status-button {
  position: absolute;
  bottom: toRem(38);
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
