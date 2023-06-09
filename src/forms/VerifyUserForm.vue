<template>
  <form class="verify-user-form" @submit.prevent="submit">
    <div class="verify-user-form__base-info">
      <div class="verify-user-form__group-field">
        <div class="verify-user-form__field">
          <h5 class="verify-user-form__field-title">
            {{ $t('verify-user-form.user-lbl') }}
          </h5>
          <combo-box-field
            v-model="form.nameId"
            scheme="secondary"
            class="verify-user-form__field-input"
            :placeholder="$t('verify-user-form.user-placeholder')"
            :error-message="getFieldErrorMessage('nameId')"
            :disabled="isFormDisabled"
            :load-pick-options="loadUsers"
            @blur="touchField('nameId')"
          />
        </div>
        <div class="verify-user-form__field">
          <h5 class="verify-user-form__field-title">
            {{ $t('verify-user-form.username-lbl') }}
          </h5>
          <input-field
            v-model="form.nickname"
            scheme="secondary"
            class="verify-user-form__field-input"
            :placeholder="$t('verify-user-form.username-lbl')"
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
        size="medium"
        modification="border-rounded"
        scheme="flat"
        :text="$t('verify-user-form.cancel-btn')"
        :disabled="isFormDisabled"
        @click="cancelForm"
      />
      <app-button
        class="verify-user-form__submit-btn"
        size="medium"
        modification="border-rounded"
        scheme="filled"
        type="submit"
        :text="$t('verify-user-form.submit-btn')"
        :disabled="isFormDisabled || !selectedUser"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { AppButton } from '@/common'
import { api } from '@/api'
import { InputField, ComboBoxField } from '@/fields'
import { useContext, useForm, useFormValidation } from '@/composables'
import { required } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import { UnverifiedModuleUser, VerifiedUser } from '@/types'
import { useAuthStore } from '@/store'
import { helpers } from '@vuelidate/validators'

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
const { currentUserId } = useAuthStore()
const users = ref<VerifiedUser[]>([])
const form = reactive<{
  nameId: string | number
  module: string
  nickname: string
}>({
  nameId: '',
  module: props.currentModule ?? '',
  nickname: props.user?.username ?? '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const isUserSelected = () => Number.isInteger(form.nameId)

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    nameId: {
      required,
      requiredSelect: helpers.withMessage(
        $t('validations.field-error_requiredSelect'),
        isUserSelected,
      ),
    },
    module: { required },
    nickname: { required },
  },
)

const selectedUser = computed(() =>
  users.value.find(user => Number(user.id) === form.nameId),
)

const cancelForm = () => {
  emit('cancel')
}

const loadUsers = async (searchValue: string) => {
  const { data } = await api.get<VerifiedUser[]>(
    '/integrations/identity-svc/users',
    {
      filter: {
        search: searchValue,
      },
    },
  )
  users.value = data

  return data.map(user => ({
    id: Number(user.id),
    text: `${user.name} ${user.surname}`,
  }))
}

const submit = async () => {
  if (!isFormValid() || !selectedUser.value?.id) return

  disableForm()
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: form.module,
          from_user: String(currentUserId),
          to_user: selectedUser.value.id,
          payload: {
            action: 'verify_user',
            user_id: String(selectedUser.value.id),
            username: form.nickname,
          },
        },
        relationships: {
          user: {
            data: {
              id: String(currentUserId),
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

  @include respond-to(tablet) {
    flex-direction: column;
    gap: toRem(16);
  }
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

.verify-user-form__field-input {
  &:deep(.select-field__select-dropdown) {
    color: var(--primary-dark);
  }
}
</style>
