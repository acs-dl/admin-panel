<template>
  <modal is-close-by-click-outside is-center @click-outside="cancelForm">
    <div class="create-user-modal__inner">
      <div class="create-user-modal__icon-wrapper">
        <icon :name="$icons.addUser" class="create-user-modal__icon" />
      </div>
      <div class="create-user-modal__title-wrapper">
        <h2 class="create-user-modal__title">
          {{ $t('create-user-modal.main-title') }}
        </h2>
        <h3 class="create-user-modal__title-secondary">
          {{ $t('create-user-modal.secondary-title') }}
        </h3>
      </div>
      <create-user-form @cancel="cancelForm" @submit="submitForm" />
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { Modal, Icon } from '@/common'
import { CreateUserForm } from '@/forms'

defineProps<{
  secondaryTitle?: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const cancelForm = () => {
  emit('cancel')
}

const submitForm = () => {
  emit('submit')
}
</script>

<style lang="scss" scoped>
.create-user-modal__inner {
  width: toRem(500);

  @include respond-to(small) {
    max-width: 100%;
  }
}

.create-user-modal__icon-wrapper {
  width: toRem(48);
  height: toRem(48);
  border: toRem(1) solid var(--border-primary-light);
  padding: toRem(12);
  border-radius: toRem(10);
  background: transparent;
  margin-bottom: toRem(12);
}

.create-user-modal__icon {
  font-size: toRem(12);
}

.create-user-modal__title-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  margin-bottom: toRem(24);
}

.create-user-modal__title {
  font-weight: 600;
  font-size: toRem(18);
  line-height: 1.4;
}

.create-user-modal__title-secondary {
  font-weight: 400;
  font-size: toRem(14);
  color: var(--text-secondary-light);
  line-height: 1.3;
}
</style>
