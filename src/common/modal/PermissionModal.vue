<template>
  <modal
    is-shown
    is-close-by-click-outside
    is-center
    @click-outside="cancelForm"
  >
    <div class="permission-modal__inner">
      <div class="permission-modal__icon-wrapper">
        <icon class="permission-modal__icon" :name="titleIconName" />
      </div>
      <div class="permission-modal__title-wrapper">
        <h2 class="permission-modal__title">
          {{ title }}
        </h2>
        <h3 class="permission-modal__title-secondary">
          {{ subtitle }}
        </h3>
      </div>
      <permission-form
        :id="id"
        :module="module"
        :module-name="foundModuleName"
        @cancel="cancelForm"
        @submit="submitForm"
      />
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { Icon, Modal } from '@/common'
import { UserPermissionInfo } from '@/types'
import { PermissionForm } from '@/forms'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlatformStore } from '@/store'
import { useContext } from '@/composables'
import { ICON_NAMES } from '@/enums'

const props = withDefaults(
  defineProps<{
    module?: UserPermissionInfo
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

const { $t } = useContext()
const { modules } = storeToRefs(usePlatformStore())

const foundModuleName = computed(
  () => modules.value.find(el => el.id === props.moduleName)?.name ?? '',
)

const titleIconName = computed(() =>
  props.moduleName ? ICON_NAMES.pencil : ICON_NAMES.plusCircle,
)

const title = computed(() =>
  props.moduleName
    ? $t('permission-modal.edit-main-title')
    : $t('permission-modal.main-title'),
)

const subtitle = computed(() =>
  props.moduleName
    ? $t('permission-modal.secondary-edit-title')
    : $t('permission-modal.secondary-create-title'),
)

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

  @include respond-to(medium) {
    max-width: 100%;
  }
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
