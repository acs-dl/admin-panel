<template>
  <transition-modal :is-shown="isShown" @click-outside="cancelForm">
    <div class="delete-modal__inner">
      <div class="delete-modal__icon-wrapper">
        <icon :name="$icons.trash" class="delete-modal__icon" />
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
          class="delete-modal__submit-btn"
          size="large"
          modification="border-rounded"
          scheme="flat"
          :text="$t('delete-modal.cancel-btn')"
          @click="cancelForm"
        />
        <app-button
          class="delete-modal__submit-btn"
          size="large"
          modification="border-rounded"
          scheme="flat"
          color="error"
          :text="$t('delete-modal.submit-btn')"
          @click="deleteUser"
        />
      </div>
    </div>
  </transition-modal>
</template>

<script lang="ts" setup>
import { TransitionModal, Icon, AppButton } from '@/common'

withDefaults(
  defineProps<{
    isShown: boolean
    mainTitle?: string
    secondaryTitle?: string
  }>(),
  {
    mainTitle: '',
    secondaryTitle: '',
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
  width: toRem(400);
}

.delete-modal__icon-wrapper {
  width: toRem(48);
  height: toRem(48);
  border: toRem(1) solid var(--border-primary-light);
  padding: toRem(12);
  border-radius: toRem(10);
  background: transparent;
  margin-bottom: toRem(12);
}

.delete-modal__icon {
  font-size: toRem(12);
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
}

.delete-modal__submit-btn {
  width: 100%;
}
</style>
