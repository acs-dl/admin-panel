<template>
  <div class="page-title">
    <h2 class="page-title__title">
      {{ title }}
    </h2>
    <sidebar-button />
  </div>
</template>

<script lang="ts" setup>
import { SidebarButton } from '@/common'

defineProps<{
  title: string
}>()
</script>

<style lang="scss" scoped>
.page-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title__title {
  line-height: 1.2;
  font-size: toRem(24);
  font-weight: 700;

  @include text-ellipsis;

  @include respond-to(small) {
    font-size: toRem(20);
  }
}
</style>
