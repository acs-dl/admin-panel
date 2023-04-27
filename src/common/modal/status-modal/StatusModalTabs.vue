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
    <select-field
      class="status-tabs__tab-select"
      scheme="secondary"
      :model-value="currentStatus"
      :value-options="statusesForSelect"
      @update:model-value="setNewStatus($event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { SelectField } from '@/fields'
import { AppButton } from '@/common'
import { REQUEST_STATUSES } from '@/enums'
import { computed } from 'vue'

const props = defineProps<{
  currentStatus: REQUEST_STATUSES
}>()

const emit = defineEmits<{
  (e: 'update:currentStatus', value: REQUEST_STATUSES): void
}>()

const statusesForSelect = computed(() => Object.values(REQUEST_STATUSES))

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

  @include respond-to(medium) {
    display: block;
    width: 100%;
    background: transparent;
  }
}

.status-tabs__tab-button {
  font-size: toRem(16);
  font-weight: 400;
  padding: toRem(8) toRem(12);
  border-radius: toRem(8);
  text-transform: capitalize;

  &--filled {
    background: var(--background-secondary-main);

    &:not([disabled]):hover,
    &:not([disabled]):focus {
      background: var(--background-secondary-main);
    }
  }

  @include respond-to(medium) {
    display: none;
  }
}

.status-tabs__tab-select {
  display: none;

  @include respond-to(medium) {
    display: block;

    &:deep(.select-field__select-head),
    &:deep(.select-field__select-dropdown-item) {
      text-transform: capitalize;
    }
  }
}
</style>
