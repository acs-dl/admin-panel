<template>
  <router-link to="/" class="app-logo">
    <icon :name="$icons.appLogo" class="app-logo__icon" />
  </router-link>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
</script>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  flex-direction: column;
  position: relative;
}

.app-logo__icon {
  max-width: toRem(65);
  max-height: toRem(65);
  width: 100%;
  height: 100%;
}
</style>
