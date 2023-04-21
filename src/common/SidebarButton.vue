<template>
  <div class="sidebar-button">
    <app-button
      class="sidebar-button__button"
      :icon-left="$icons.burger"
      @click="openSidebar"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { Bus } from '@/helpers'

const openSidebar = () => {
  Bus.toggleSidebar()
}
</script>

<style scoped lang="scss">
.sidebar-button__button {
  display: none;

  @include respond-to(medium) {
    display: flex;
    width: toRem(20);
    height: toRem(20);
    color: var(--text-primary-main);
  }
}
</style>
