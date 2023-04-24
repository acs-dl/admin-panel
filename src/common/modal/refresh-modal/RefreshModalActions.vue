<template>
  <div class="refresh-modal-actions">
    <app-button
      class="refresh-modal-actions__button"
      size="medium"
      modification="border-rounded"
      scheme="flat"
      :text="$t('refresh-modal-actions.cancel-button')"
      @click="emit('cancel')"
    />
    <app-button
      class="refresh-modal-actions__button"
      size="medium"
      modification="border-rounded"
      scheme="filled"
      :disabled="isSubmitDisabled"
      :text="$t('refresh-modal-actions.refresh-button')"
      @click="emit('submit')"
    />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'

defineProps<{
  isSubmitDisabled: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()
</script>

<style lang="scss" scoped>
.refresh-modal-actions {
  width: 100%;
  display: flex;
  gap: toRem(12);
}

.refresh-modal-actions__button {
  flex: 1;
}
</style>
