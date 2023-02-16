<template>
  <form class="verify-user-form" @submit.prevent="submit">
    <div class="verify-user-form__base-info">
      <div class="verify-user-form__group-field">
        <div class="verify-user-form__field">
          <h5 class="verify-user-form__field-title">
            {{ $t('verify-user-form.user-lbl') }}
          </h5>
          <input-dropdown-field
            v-model="form.name"
            v-model:user="selectedUser"
            scheme="secondary"
            class="verify-user-form__field-input"
            :placeholder="$t('verify-user-form.user-placeholder')"
            :error-message="getFieldErrorMessage('name')"
            :disabled="isFormDisabled"
            @blur="touchField('name')"
          />
        </div>
        <div class="verify-user-form__field">
          <h5 class="verify-user-form__field-title">
            {{ $t('verify-user-form.nickname-lbl') }}
          </h5>
          <input-field
            v-model="form.nickname"
            scheme="secondary"
            class="verify-user-form__field-input"
            :placeholder="$t('verify-user-form.nickname-lbl')"
            :error-message="getFieldErrorMessage('nickname')"
            :disabled="isFormDisabled"
            @blur="touchField('nickname')"
          />
        </div>
      </div>
    </div>

    <div class="verify-user-form__actions">
      <app-button
        class="verify-user-form__submit-btn"
        size="large"
        modification="border-rounded"
        scheme="flat"
        :text="$t('verify-user-form.cancel-btn')"
        :disabled="isFormDisabled"
        @click="cancelForm"
      />
      <app-button
        class="verify-user-form__submit-btn"
        size="large"
        modification="border-rounded"
        scheme="filled"
        type="submit"
        :text="$t('verify-user-form.submit-btn')"
        :disabled="isFormDisabled"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { AppButton } from '@/common'
import { api } from '@/api'
import { InputField, InputDropdownField } from '@/fields'
import { useContext, useForm, useFormValidation } from '@/composables'
import { required } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import { UnverifiedModuleUser, VerifiedUser } from '@/types'
import { useAuthStore } from '@/store'

const props = withDefaults(
  defineProps<{
    user?: UnverifiedModuleUser
  }>(),
  {
    user: undefined,
  },
)

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const { $t } = useContext()
const { currentUserId } = useAuthStore()
const selectedUser = ref<VerifiedUser | null>(null)
const form = reactive({
  name: '',
  module: props.user.module ?? '',
  nickname: props.user?.username ?? '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    name: { required },
    module: { required },
    nickname: { required },
  },
)

const cancelForm = () => {
  emit('cancel')
}

const submit = async () => {
  if (!isFormValid() || !selectedUser.value?.id) return

  disableForm()
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: form.module.toLowerCase(),
          ...(currentUserId ? { from_user: String(currentUserId) } : {}),
          to_user: selectedUser.value.id,
          payload: {
            action: 'verify_user',
            user_id: String(selectedUser.value?.id),
            username: form.nickname,
          },
        },
        relationships: {
          user: {
            data: {
              id: '1',
            },
          },
        },
      },
    })
    Bus.info($t('verify-user-form.success-msg'))
    emit('submit')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.verify-user-form {
  display: grid;
  grid-gap: toRem(24);
  width: 100%;
}

.verify-user-form__base-info {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.verify-user-form__group-field {
  display: flex;
  gap: toRem(8);
}

.verify-user-form__field {
  display: flex;
  flex-direction: column;
  gap: toRem(6);
  width: 100%;
}

.verify-user-form__field-title {
  font-size: toRem(14);
  font-weight: 500;
}

.verify-user-form__submit-btn {
  width: 100%;
}

.verify-user-form__actions {
  display: flex;
  gap: toRem(16);
}
</style>
