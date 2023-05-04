<template>
  <modal is-close-by-click-outside is-center @click-outside="cancelForm">
    <div class="delete-modal__inner">
      <div class="delete-modal__icon-wrapper">
        <icon :name="$icons.filledTrash" class="delete-modal__icon" />
      </div>
      <div class="delete-modal__title-wrapper">
        <h2 class="delete-modal__title">
          {{ mainTitle || $t('delete-modal.main-title') }}
        </h2>
        <p class="delete-modal__title-secondary">
          {{ secondaryTitle || $t('delete-modal.secondary-title') }}
        </p>
      </div>
      <div class="delete-modal__actions">
        <app-button
          class="delete-modal__action-btn"
          size="medium"
          modification="border-rounded"
          scheme="flat"
          :disabled="isDisabled"
          :text="$t('delete-modal.cancel-btn')"
          @click="cancelForm"
        />
        <app-button
          class="delete-modal__action-btn delete-modal__submit-btn"
          size="medium"
          scheme="filled"
          modification="border-rounded"
          color="error"
          :disabled="isDisabled"
          :text="$t('delete-modal.submit-btn')"
          @click="deleteUser"
        />
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { Modal, Icon, AppButton } from '@/common'

withDefaults(
  defineProps<{
    mainTitle?: string
    secondaryTitle?: string
    isDisabled?: boolean
  }>(),
  {
    mainTitle: '',
    secondaryTitle: '',
    isDisabled: false,
  },
)

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'delete'): void
}>()

const cancelForm = () => {
  emit('cancel')
}

const deleteUser = () => {
  emit('delete')
}
</script>

<style lang="scss" scoped>
.delete-modal__inner {
  max-width: toRem(500);

  @include respond-to(medium) {
    width: 100%;
  }
}

.delete-modal__icon-wrapper {
  width: toRem(56);
  height: toRem(56);
  margin-bottom: toRem(12);
}

.delete-modal__icon {
  font-size: toRem(56);
  color: var(--error-main);
}

.delete-modal__title-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  margin-bottom: toRem(12);
}

.delete-modal__title {
  font-weight: 600;
  font-size: toRem(18);
  line-height: 1.4;
}

.delete-modal__title-secondary {
  font-weight: 400;
  font-size: toRem(14);
  color: var(--text-secondary-light);
  line-height: 1.3;
}

.delete-modal__actions {
  display: flex;
  gap: toRem(16);
  margin-top: toRem(24);
}

.delete-modal__action-btn {
  width: 100%;
}

.delete-modal__submit-btn {
  color: var(--text-primary-invert-main);

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    color: var(--text-primary-invert-main);
  }
}
</style>
