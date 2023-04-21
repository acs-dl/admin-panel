<template>
  <div class="unverified-users-list-header">
    <component
      :is="responseItem"
      :current-module-filter="currentModuleFilter"
      :module-names="moduleNames"
      :current-order="currentOrder"
      :current-sorting-type="currentSortingType"
      :current-page="currentPage"
      :page-count="pageCount"
      :total-amount="totalAmount"
      :min-page-amount="minPageAmount"
      @update:current-module-filter="emit('update:currentModuleFilter', $event)"
      @update:current-order="emit('update:currentOrder', $event)"
      @update:current-sorting-type="emit('update:currentSortingType', $event)"
      @update:current-page="emit('update:currentPage', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import {
  REQUEST_ORDER,
  UNVERIFIED_USER_SORTING_PARAMS,
  WINDOW_BREAKPOINTS,
} from '@/enums'
import { useWindowSize } from '@vueuse/core'
import UnverifiedUsersListHeaderDesktop from '@/pages/unverified-users/UnverifiedUsersListHeaderDesktop.vue'
import UnverifiedUsersListHeaderMobile from '@/pages/unverified-users/UnverifiedUsersListHeaderMobile.vue'

defineProps<{
  currentModuleFilter: string
  moduleNames: string[]
  currentOrder: REQUEST_ORDER
  currentSortingType: UNVERIFIED_USER_SORTING_PARAMS
  currentPage: number
  pageCount: number
  totalAmount: number
  minPageAmount: number
}>()

const emit = defineEmits<{
  (e: 'update:currentModuleFilter', value: string): void
  (e: 'update:currentOrder', value: REQUEST_ORDER): void
  (e: 'update:currentSortingType', value: UNVERIFIED_USER_SORTING_PARAMS): void
  (e: 'update:currentPage', value: number): void
}>()

const { width } = useWindowSize()

const responseItem = computed(() =>
  width.value > WINDOW_BREAKPOINTS.medium
    ? UnverifiedUsersListHeaderDesktop
    : UnverifiedUsersListHeaderMobile,
)
</script>
