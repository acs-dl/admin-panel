<template>
  <div class="order-buttons">
    <app-button
      class="order-buttons__button"
      :class="{
        'order-buttons__button--active': isAscOrder || !isCurrentOrder,
      }"
      :icon-left="$icons.smallArrow"
      @click="updateState(REQUEST_ORDER.asc)"
    />
    <app-button
      class="order-buttons__button"
      :class="{ 'order-buttons__button--active': isDescOrder }"
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
  () => props.sortingTypeForPick === props.currentSortingType,
)

const isAscOrder = computed(
  () => props.order === REQUEST_ORDER.asc && isCurrentOrder.value,
)
const isDescOrder = computed(
  () => props.order === REQUEST_ORDER.desc && isCurrentOrder.value,
)

const updateState = (order: REQUEST_ORDER) => {
  if (props.sortingTypeForPick) {
    emit('update:currentSortingType', props.sortingTypeForPick)
  }
  emit('update:order', order)
}
</script>

<style lang="scss" scoped>
.order-buttons {
  display: flex;
  flex-direction: column;
  gap: toRem(3);
}

.order-buttons__button {
  color: var(--text-primary-light);
  max-width: toRem(8);
  max-height: toRem(8);

  &:last-child {
    transform: rotate(180deg);
  }

  &--active {
    color: var(--text-primary-main);
  }
}
</style>
