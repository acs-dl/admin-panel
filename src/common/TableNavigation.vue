<template>
  <div class="table-navigation">
    <app-button
      class="table-navigation__button"
      size="medium"
      scheme="flat"
      modification="border-rounded"
      :icon-left="$icons.arrowSmLeft"
      :disabled="currentPage <= MIN_PAGE_AMOUNT"
      @click="decreasePageCount"
    />
    <span class="table-navigation__text">
      {{
        $t('users-list-section.navigation-text', {
          currentPage: currentPage,
          totalPage: pageCount,
        })
      }}
    </span>
    <app-button
      class="table-navigation__button"
      size="medium"
      scheme="flat"
      modification="border-rounded"
      :disabled="currentPage >= pageCount"
      :icon-left="$icons.arrowSmRight"
      @click="increasePageCount"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { MIN_PAGE_AMOUNT } from '@/consts'

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
}>()

const props = defineProps<{
  currentPage: number
  pageCount: number
}>()

const increasePageCount = async () => {
  if (props.currentPage < props.pageCount) {
    emit('update:currentPage', props.currentPage + 1)
  }
}

const decreasePageCount = async () => {
  if (props.currentPage > MIN_PAGE_AMOUNT) {
    emit('update:currentPage', props.currentPage - 1)
  }
}
</script>

<style lang="scss">
.table-navigation {
  display: flex;
  align-items: center;
  column-gap: toRem(20);
}
</style>
