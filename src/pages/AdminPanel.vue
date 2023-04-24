<template>
  <div class="admin-panel">
    <app-sidebar
      @open-status-modal="toggleStatusModal"
      @open-refresh-modal="toggleRefreshModal"
    />
    <router-view class="admin-panel__inner" />
    <transition-modal>
      <status-modal v-if="isStatusModalOpened" @close="toggleStatusModal" />
      <refresh-modal v-if="isRefreshModalOpened" @close="toggleRefreshModal" />
    </transition-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  AppSidebar,
  StatusModal,
  TransitionModal,
  RefreshModal,
} from '@/common'
import { useAuthStore, usePlatformStore } from '@/store'
import { ErrorHandler } from '@/helpers'

const { logout } = useAuthStore()
const { getAllPositions, getAllModules, getAllRoles } = usePlatformStore()
const isStatusModalOpened = ref(false)
const isRefreshModalOpened = ref(false)

const toggleStatusModal = () => {
  isStatusModalOpened.value = !isStatusModalOpened.value
}

const toggleRefreshModal = () => {
  isRefreshModalOpened.value = !isRefreshModalOpened.value
}

const init = async () => {
  try {
    await Promise.all([getAllPositions(), getAllModules(), getAllRoles()])
  } catch (e) {
    logout()
    ErrorHandler.process(e)
  }
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

.admin-panel__inner {
  max-width: 100vw;
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

  @include respond-to(medium) {
    display: none;
  }
}
</style>
