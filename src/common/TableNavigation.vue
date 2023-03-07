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
    <input-field
      class="table-navigation__input"
      type="number"
      scheme="tertiary"
      v-model="tablePage"
      :max="pageCount"
      :min="MIN_PAGES_AMOUNT"
      @keydown.enter="emit('update:currentPage', tablePage || pageCount)"
      @blur="emit('update:currentPage', tablePage || pageCount)"
    />
    <span class="table-navigation__text">
      {{
        $t('users-list-section.navigation-text', {
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
import { ref } from 'vue'
import { AppButton } from '@/common'
import { InputField } from '@/fields'
import { MIN_PAGE_AMOUNT } from '@/consts'

const MIN_PAGES_AMOUNT = 1

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
}>()

const props = defineProps<{
  currentPage: number
  pageCount: number
}>()

const tablePage = ref(props.currentPage)

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

<style lang="scss" scoped>
.table-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: toRem(10);
}

.table-navigation__input {
  max-width: toRem(45);
  height: toRem(45);
  text-align: center;

  &:deep(.input-field__input) {
    box-shadow: none;
    padding: toRem(12) toRem(10);
    text-align: center;
  }
}
</style>
