<template>
  <div class="refresh-submodule-item">
    <span class="refresh-submodule-item__text">
      {{ $filter.module(name) }}
    </span>
    <app-button
      class="refresh-submodule-item__btn"
      color="gray"
      :icon-left="$icons.trash"
      @click="emit('delete', name)"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'

defineProps<{
  name: string
}>()

const emit = defineEmits<{
  (e: 'delete', value: string): void
}>()
</script>

<style lang="scss" scoped>
.refresh-submodule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: toRem(15) toRem(12);
  background: var(--background-primary-dark);
}

.refresh-submodule-item__text {
  font-size: toRem(14);
  max-width: calc(100% - #{toRem(24)});

  @include text-ellipsis;
}

.refresh-submodule-item__btn {
  &:deep(.app-button__text) {
    font-weight: 400;
  }

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}
</style>
