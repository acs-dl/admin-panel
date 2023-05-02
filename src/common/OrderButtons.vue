<template>
  <div class="order-buttons">
    <app-button
      v-if="isAscOrder || isClearOrder || !isCurrentOrder"
      class="order-buttons__button"
      :class="{ 'order-buttons__button--active': isCurrentOrder && isAscOrder }"
      :icon-left="$icons.smallArrow"
      @click="updateState(REQUEST_ORDER.asc)"
    />
    <app-button
      v-if="isDescOrder || isClearOrder || !isCurrentOrder"
      class="order-buttons__button order-buttons__button--desc"
      :class="{
        'order-buttons__button--desc-active': isDescOrder && isCurrentOrder,
      }"
      :icon-left="$icons.smallArrow"
      @click="updateState(REQUEST_ORDER.desc)"
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * The component is used to select the order and type of sorting.
 *
 * @props {REQUEST_ORDER} order - Current request order.
 * @props {string} currentSortingType - Current sorting type.
 * @props {string} sortingTypeForPick -
 * Sorting type which will be set to current sorting type.
 * @emits {void} update:currentSortingType -
 * Triggered when the user clicks one of the buttons that determine
 * the order of the request. Accepts a new value to change the
 * request type.
 * @emits {void} update:order - Triggered when the user clicks one
 * of the buttons that determine the order of the request. Accepts
 * a new value to change the request order.
 */

import { AppButton } from '@/common'
import { REQUEST_ORDER } from '@/enums'
import { computed } from 'vue'

const props = defineProps<{
  order: REQUEST_ORDER
  currentSortingType?: string
  sortingTypeForPick?: string
}>()

const emit = defineEmits<{
  (e: 'update:currentSortingType', value: string): void
  (e: 'update:order', value: string): void
}>()

const isCurrentOrder = computed(
  () => props.currentSortingType === props.sortingTypeForPick,
)

const isAscOrder = computed(() => props.order === REQUEST_ORDER.asc)

const isClearOrder = computed(() => props.order === REQUEST_ORDER.empty)

const isDescOrder = computed(() => props.order === REQUEST_ORDER.desc)

const updateState = (order: REQUEST_ORDER) => {
  emit(
    'update:order',
    isClearOrder.value || !isCurrentOrder.value ? order : REQUEST_ORDER.empty,
  )
  if (!props.sortingTypeForPick) return
  emit('update:currentSortingType', props.sortingTypeForPick)
}
</script>

<style lang="scss" scoped>
.order-buttons {
  display: flex;
  flex-direction: column;
  gap: toRem(2);
  align-items: center;
  justify-content: center;
}

.order-buttons__button {
  color: var(--text-primary-light);
  max-width: toRem(9);
  max-height: toRem(9);

  &--active {
    transform: translateY(-25%);
  }

  &--desc {
    transform: rotate(180deg);
  }

  &--desc-active {
    transform: rotate(180deg) translateY(-25%);
  }

  &:not([disabled]):focus {
    color: var(--text-primary-light);
  }
}
</style>
