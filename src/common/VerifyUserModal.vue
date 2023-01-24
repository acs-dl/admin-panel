<template>
  <modal is-shown>
    <div class="verify-user-modal__inner">
      <div class="verify-user-modal__icon-wrapper">
        <icon
          :name="$icons.informationCircle"
          class="verify-user-modal__icon"
        />
      </div>
      <div class="verify-user-modal__title-wrapper">
        <h2 class="verify-user-modal__title">
          {{ $t('verify-user-modal.main-title') }}
        </h2>
        <h3 class="verify-user-modal__title-secondary">
          {{ $t('verify-user-modal.secondary-title') }}
        </h3>
      </div>
      <tabs v-model="currentTab" class="verify-user-modal__tabs" :tabs="TABS" />
      <verify-user-form
        v-if="currentTab === TABS[0].id"
        :user="user"
        @cancel="cancelForm"
        @submit="sumbitForm"
      />
      <create-user-form
        v-else
        :user="user"
        @cancel="cancelForm"
        @submit="sumbitForm"
      />
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Modal, Icon, Tabs } from '@/common'
import { UnverifiedUser } from '@/types'
import { useContext } from '@/composables'
import VerifyUserForm from '@/forms/VerifyUserForm.vue'
import CreateUserForm from '@/forms/CreateUserForm.vue'

defineProps<{
  user: UnverifiedUser
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const { $t } = useContext()
const TABS = [
  {
    title: $t('verify-user-modal.add-account-title'),
    message: $t('verify-user-modal.add-account-msg'),
    id: 'add-account-tab',
  },
  {
    title: $t('verify-user-modal.create-account-title'),
    message: $t('verify-user-modal.create-account-msg'),
    id: 'create-account-tab',
  },
]
const currentTab = ref(TABS[0].id)

const cancelForm = () => {
  emit('cancel')
}

const sumbitForm = () => {
  emit('submit')
}
</script>

<style lang="scss" scoped>
.verify-user-modal__icon-wrapper {
  width: toRem(48);
  height: toRem(48);
  border: toRem(1) solid var(--border-primary-light);
  padding: toRem(12);
  border-radius: toRem(10);
  background: transparent;
  margin-bottom: toRem(12);
}

.verify-user-modal__icon {
  font-size: toRem(12);
}

.verify-user-modal__title-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  margin-bottom: toRem(12);
}

.verify-user-modal__title {
  font-weight: 600;
  font-size: toRem(14);
}

.verify-user-modal__title-secondary {
  font-size: toRem(14);
  color: var(--text-secondary-light);
}

.verify-user-modal__tabs {
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  margin-bottom: toRem(24);
}
</style>
