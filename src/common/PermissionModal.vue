<template>
  <modal is-shown>
    <div class="permission-modal__inner">
      <div class="permission-modal__icon-wrapper">
        <icon class="permission-modal__icon" :name="$icons.informationCircle" />
      </div>
      <div class="permission-modal__title-wrapper">
        <h2 class="permission-modal__title">
          {{ $t('permission-modal.main-title') }}
        </h2>
        <h3 class="permission-modal__title-secondary">
          {{ $t('permission-modal.secondary-title') }}
        </h3>
      </div>
      <permission-form
        :id="id"
        :module="module"
        :module-name="moduleName"
        @cancel="cancelForm"
        @submit="submitForm"
      />
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { Modal, Icon } from '@/common'
import PermissionForm from '@/forms/PermissionForm.vue'
import { UserPermisonInfo } from '@/types'

withDefaults(
  defineProps<{
    module?: UserPermisonInfo
    moduleName?: string
    id: string
  }>(),
  {
    module: undefined,
    moduleName: '',
  },
)

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
.permission-modal__inner {
  width: toRem(500);
}

.permission-modal__icon-wrapper {
  width: toRem(48);
  height: toRem(48);
  border: toRem(1) solid var(--border-primary-light);
  padding: toRem(12);
  border-radius: toRem(10);
  background: transparent;
  margin-bottom: toRem(12);
}

.permission-modal__icon {
  font-size: toRem(12);
}

.permission-modal__title-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  margin-bottom: toRem(12);
}

.permission-modal__title {
  font-weight: 600;
  font-size: toRem(18);
  line-height: 1.4;
}

.permission-modal__title-secondary {
  font-weight: 400;
  font-size: toRem(14);
  color: var(--text-secondary-light);
  line-height: 1.3;
}
</style>
