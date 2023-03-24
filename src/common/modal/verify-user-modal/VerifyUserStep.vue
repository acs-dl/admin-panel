<template>
  <div class="verify-user-step">
    <div class="verify-user-step__icon-wrapper">
      <icon :name="$icons.doubleCircleCheck" class="verify-user-step__icon" />
    </div>
    <div class="verify-user-step__title-wrapper">
      <h2 class="verify-user-step__title">
        {{ $t('verify-user-step.main-title') }}
      </h2>
      <h3 class="verify-user-step__title-secondary">
        {{ $t('verify-user-step.secondary-title') }}
      </h3>
    </div>
    <tabs v-model="currentTab" class="verify-user-step__tabs" :tabs="TABS" />
    <verify-user-form
      v-if="currentTab === TABS[0].id"
      :user="user"
      :current-module="chosenModule"
      @cancel="cancelForm"
      @submit="submitForm"
    />
    <create-user-form
      v-else
      :user="user"
      :current-module="chosenModule"
      @cancel="cancelForm"
      @submit="submitForm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Icon, Tabs } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { useContext } from '@/composables'
import { CreateUserForm, VerifyUserForm } from '@/forms'

defineProps<{
  user: UnverifiedModuleUser
  chosenModule: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const { $t } = useContext()
const TABS = [
  {
    title: $t('verify-user-step.add-account-title'),
    message: $t('verify-user-step.add-account-msg'),
    id: 'add-account-tab',
  },
  {
    title: $t('verify-user-step.create-account-title'),
    message: $t('verify-user-step.create-account-msg'),
    id: 'create-account-tab',
  },
]
const currentTab = ref(TABS[0].id)

const cancelForm = () => {
  emit('cancel')
}

const submitForm = () => {
  emit('submit')
}
</script>

<style lang="scss" scoped>
.verify-user-step {
  width: toRem(600);
}

.verify-user-step__icon-wrapper {
  width: toRem(48);
  height: toRem(48);
  border-radius: toRem(10);
  background: transparent;
  margin-bottom: toRem(12);
}

.verify-user-step__icon {
  font-size: toRem(12);
  color: var(--primary-main);
}

.verify-user-step__title-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  margin-bottom: toRem(12);
}

.verify-user-step__title {
  font-weight: 600;
  font-size: toRem(18);
}

.verify-user-step__title-secondary {
  font-size: toRem(14);
  color: var(--text-secondary-light);
}

.verify-user-step__tabs {
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  margin-bottom: toRem(24);
}
</style>
