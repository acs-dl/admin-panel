<template>
  <div class="admin-panel">
    <div class="admin-panel__sidebar-wrapper">
      <app-sidebar class="admin-panel__sidebar" />
    </div>
    <router-view class="admin-panel__inner" />
  </div>
</template>

<script lang="ts" setup>
import { AppSidebar } from '@/common'
</script>

<style scoped lang="scss">
.admin-panel {
  padding: 0;
  display: flex;
  min-width: 100vh;
  min-height: 100vh;
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
</style>
