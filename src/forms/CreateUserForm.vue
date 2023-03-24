<template>
  <form class="create-user-form" @submit.prevent="submit">
    <div class="create-user-form__base-info">
      <div class="create-user-form__field">
        <h5 class="create-user-form__field-title">
          {{ $t('create-user-form.name-lbl') }}
        </h5>
        <input-field
          v-model="form.name"
          scheme="secondary"
          class="create-user-form__field-input"
          :placeholder="$t('create-user-form.name-lbl')"
          :error-message="getFieldErrorMessage('name')"
          :disabled="isFormDisabled"
          @blur="touchField('name')"
        />
      </div>
      <div class="create-user-form__field">
        <h5 class="create-user-form__field-title">
          {{ $t('create-user-form.surname-lbl') }}
        </h5>
        <input-field
          v-model="form.surname"
          scheme="secondary"
          class="create-user-form__field-input"
          :placeholder="$t('create-user-form.surname-lbl')"
          :error-message="getFieldErrorMessage('surname')"
          :disabled="isFormDisabled"
          @blur="touchField('surname')"
        />
      </div>
    </div>
    <div class="create-user-form__field">
      <h5 class="create-user-form__field-title">
        {{ $t('create-user-form.position-lbl') }}
      </h5>
      <select-field
        v-model="form.position"
        scheme="secondary"
        class="create-user-form__field-select"
        :value-options="positions"
        :placeholder="$t('create-user-form.position-placeholder')"
        :error-message="getFieldErrorMessage('position')"
        @blur="touchField('position')"
      />
    </div>

    <div class="create-user-form__field">
      <h5 class="create-user-form__field-title">
        {{ $t('create-user-form.email-lbl') }}
      </h5>
      <input-field
        v-model="form.emailAddress"
        scheme="secondary"
        class="create-user-form__field-input"
        :placeholder="$t('create-user-form.email-lbl')"
        :error-message="getFieldErrorMessage('emailAddress')"
        :disabled="isFormDisabled"
        @blur="touchField('emailAddress')"
      />
    </div>

    <div class="create-user-form__actions">
      <app-button
        class="create-user-form__submit-btn"
        size="large"
        modification="border-rounded"
        scheme="flat"
        :text="$t('create-user-form.cancel-btn')"
        :disabled="isFormDisabled"
        @click="cancelForm"
      />
      <app-button
        class="create-user-form__submit-btn"
        size="large"
        modification="border-rounded"
        scheme="filled"
        type="submit"
        :text="$t('create-user-form.submit-btn')"
        :disabled="isFormDisabled"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { AppButton } from '@/common'
import { api } from '@/api'
import { InputField, SelectField } from '@/fields'
import { useForm, useFormValidation } from '@/composables'
import { email, maxLength, required } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import { DateUtil } from '@/utils'
import { UnverifiedModuleUser, VerifiedUser } from '@/types'
import { useContext } from '@/composables'
import { useAuthStore, usePlatformStore } from '@/store'
import { router } from '@/router'
import { MAX_LENGTH, ROUTE_NAMES } from '@/enums'

const props = withDefaults(
  defineProps<{
    user?: UnverifiedModuleUser
    currentModule?: string
  }>(),
  {
    user: undefined,
    currentModule: '',
  },
)

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const { $t } = useContext()
const { positions } = usePlatformStore()
const { currentUserId } = useAuthStore()

const form = reactive({
  name: '',
  surname: '',
  emailAddress: '',
  position: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    name: { required, maxLength: maxLength(MAX_LENGTH.name) },
    surname: { required, maxLength: maxLength(MAX_LENGTH.surname) },
    emailAddress: { email, required },
    position: { required },
  },
)

const cancelForm = () => {
  emit('cancel')
}

const verifyUser = async (newUser: VerifiedUser) => {
  await api.post('/integrations/orchestrator/requests', {
    data: {
      attributes: {
        module: props.currentModule ?? '',
        from_user: String(currentUserId),
        to_user: newUser.id,
        payload: {
          action: 'verify_user',
          user_id: String(newUser.id),
          username: props.user.username,
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
}

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    const { data } = await api.post<VerifiedUser>(
      '/integrations/identity-svc/users',
      {
        data: {
          type: 'users',
          id: DateUtil.toTimestamp().toString(),
          attributes: {
            name: form.name,
            surname: form.surname,
            position: form.position,
            email: form.emailAddress,
          },
        },
      },
    )

    if (props.user) {
      await verifyUser(data)
    }

    Bus.success($t('create-user-form.success-msg'))
    emit('submit')
    await router.push({
      name: ROUTE_NAMES.userDetails,
      params: { id: data.id },
    })
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.create-user-form {
  display: grid;
  grid-gap: toRem(24);
  width: 100%;
}

.create-user-form__base-info {
  display: flex;
  gap: toRem(16);
}

.create-user-form__field {
  display: flex;
  flex-direction: column;
  gap: toRem(6);
  width: 100%;
}

.create-user-form__field-title {
  font-size: toRem(14);
  font-weight: 500;
}

.create-user-form__submit-btn {
  width: 100%;
}

.create-user-form__actions {
  display: flex;
  gap: toRem(16);
}
</style>
