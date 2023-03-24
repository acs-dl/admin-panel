<template>
  <modal is-close-by-click-outside is-center @click-outside="emit('cancel')">
    <verify-module-step
      v-if="currentStep === STEPS.moduleChoosingStep"
      :user="user"
      @cancel="emit('cancel')"
      @verify="moveToNextStep"
      @delete="emit('delete-module', $event)"
    />
    <verify-user-step
      v-else
      :user="user"
      :chosen-module="chosenModule"
      @submit="emit('submit')"
      @cancel="verifyCancel"
    />
  </modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Modal } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import VerifyUserStep from '@/common/modal/verify-user-modal/VerifyUserStep.vue'
import VerifyModuleStep from '@/common/modal/verify-user-modal/VerifyModuleStep.vue'

enum STEPS {
  moduleChoosingStep = 1,
  verifyUserStep = 2,
}

const props = defineProps<{
  isMultipleModules: boolean
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
  (e: 'delete-module', value: string): void
}>()

const chosenModule = ref(props.user.module[0])

const currentStep = ref(
  props.isMultipleModules ? STEPS.moduleChoosingStep : STEPS.verifyUserStep,
)

const moveToNextStep = (module: string) => {
  currentStep.value = STEPS.verifyUserStep
  chosenModule.value = module
}

const verifyCancel = () => {
  if (props.isMultipleModules) {
    currentStep.value = STEPS.moduleChoosingStep
    return
  }
  emit('cancel')
}
</script>
