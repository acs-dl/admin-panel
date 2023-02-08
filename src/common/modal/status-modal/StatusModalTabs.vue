<template>
  <div class="status-tabs">
    <app-button
      class="status-tabs__tab-button"
      v-for="(status, idx) in REQUEST_STATUSES"
      :class="{ 'status-tabs__tab-button--filled': status === currentStatus }"
      :key="idx"
      :text="status"
      @click="setNewStatus(status)"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { REQUEST_STATUSES } from '@/enums'

const props = defineProps<{
  currentStatus: REQUEST_STATUSES
}>()

const emit = defineEmits<{
  (e: 'update:currentStatus', value: REQUEST_STATUSES): void
}>()

const setNewStatus = (status: REQUEST_STATUSES) => {
  if (props.currentStatus === status) return
  emit('update:currentStatus', status)
}
</script>

<style lang="scss" scoped>
.status-tabs {
  display: flex;
  padding: toRem(8);
  gap: toRem(8);
  background: var(--background-primary-dark);
  border-radius: toRem(8);
}

.status-tabs__tab-button {
  font-size: toRem(16);
  font-weight: 400;
  padding: toRem(8) toRem(12);
  text-transform: capitalize;
  border-radius: toRem(8);

  &--filled {
    background: var(--background-secondary-main);

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      background: var(--background-secondary-main);
    }
  }
}
</style>
