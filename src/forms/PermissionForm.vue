<template>
  <form class="permission-form" @submit.prevent="submit">
    <div class="permission-form__field-wrapper">
      <div class="permission-form__field">
        <h5 class="permission-form__field-title">
          {{ $t('permission-form.module-lbl') }}
        </h5>
        <select-field
          v-model="form.module"
          scheme="secondary"
          class="permission-form__field-select"
          :value-options="modulesNames"
          :placeholder="$t('permission-form.module-placeholder')"
          :error-message="getFieldErrorMessage('module')"
          :disabled="isFormDisabled || isEditForm"
          @blur="touchField('module')"
        />
      </div>
      <template v-if="isEmailModule">
        <div class="permission-form__field">
          <h5 class="permission-form__field-title">
            {{ $t('permission-form.name-lbl') }}
          </h5>
          <input-field
            v-model="form.name"
            scheme="secondary"
            class="permission-form__field-input"
            :placeholder="$t('permission-form.name-lbl')"
            :error-message="getFieldErrorMessage('name')"
            :disabled="isFormDisabled"
            @blur="touchField('name')"
          />
        </div>

        <div class="permission-form__field">
          <h5 class="permission-form__field-title">
            {{ $t('permission-form.surname-lbl') }}
          </h5>
          <input-field
            v-model="form.surname"
            scheme="secondary"
            class="permission-form__field-input"
            :placeholder="$t('permission-form.surname-lbl')"
            :error-message="getFieldErrorMessage('surname')"
            :disabled="isFormDisabled"
            @blur="touchField('surname')"
          />
        </div>

        <div class="permission-form__field">
          <h5 class="permission-form__field-title">
            {{ $t('permission-form.email-lbl') }}
          </h5>
          <input-field
            v-model="form.email"
            scheme="secondary"
            class="permission-form__field-input"
            :placeholder="$t('permission-form.email-lbl')"
            :error-message="getFieldErrorMessage('email')"
            :disabled="isFormDisabled"
            @blur="touchField('email')"
          />
        </div>
      </template>
      <template v-else>
        <div class="permission-form__field">
          <h5 class="permission-form__field-title">
            {{ $t('permission-form.link-lbl') }}
          </h5>
          <input-field
            v-model="form.link"
            scheme="secondary"
            class="permission-form__field-input"
            :class="`permission-form__field-input--${moduleId}`"
            :placeholder="$t('permission-form.link-placeholder')"
            :error-message="getFieldErrorMessage('link')"
            :disabled="isFormDisabled || isEditForm"
            @blur="touchField('link')"
          >
            <template v-if="prefix && isModulePrefix" #nodeLeft>
              <div class="permission-form__origin">
                <span class="permission-form__origin-text">
                  {{ prefix }}
                </span>
              </div>
            </template>
          </input-field>
        </div>

        <div class="permission-form__field">
          <h5 class="permission-form__field-title">
            {{ $t('permission-form.username-lbl') }}
          </h5>
          <input-field
            v-model="form.username"
            scheme="secondary"
            class="permission-form__field-input"
            :placeholder="$t('permission-form.username-lbl')"
            :error-message="getFieldErrorMessage('username')"
            :disabled="isFormDisabled || isEditForm || isUsernameInputDisabled"
            @blur="touchField('username')"
          />
        </div>

        <div v-if="!isTelegramModule" class="permission-form__field">
          <h5 class="permission-form__field-title">
            {{ $t('permission-form.access-level-lbl') }}
          </h5>
          <select-field
            v-model="form.accessLevel"
            scheme="secondary"
            class="permission-form__field-access-select"
            :value-options="accessNameList"
            :placeholder="$t('permission-form.access-level-placeholder')"
            :error-message="getFieldErrorMessage('accessLevel')"
            :disabled="isFormDisabled || !(accessList && isAccessLevelRequired)"
            @blur="touchField('accessLevel')"
          />
        </div>
      </template>
      <template v-if="!isModulePrefix && !isEmailModule">
        <div class="permission-form__field">
          <h5 class="permission-form__field-title">
            {{ $t('permission-form.phone-lbl') }}
          </h5>
          <input-field
            v-model="form.phoneNumber"
            scheme="secondary"
            v-mask="'## ### ## ##'"
            :class="[
              'permission-form__field-input',
              'permission-form__field-input--phone',
            ]"
            :placeholder="$t('permission-form.phone-lbl')"
            :error-message="getFieldErrorMessage('phoneNumber')"
            :disabled="isFormDisabled || isEditForm || isPhoneInputDisabled"
            @blur="touchField('phoneNumber')"
          >
            <template v-if="prefix && !isModulePrefix" #nodeLeft>
              <div class="permission-form__origin">
                <span class="permission-form__origin-text">
                  {{ prefix }}
                </span>
              </div>
            </template>
          </input-field>
        </div>
      </template>
    </div>

    <div class="permission-form__loading-modules-info">
      <template v-if="isLoadingPermissionsError && !isEmailModule">
        <div class="permission-form__loading-error">
          <icon
            class="permission-form__loading-error-icon"
            :name="$icons.informationCircle"
          />
          <span class="permission-form__loading-error-text">
            {{ $t('permission-form.modules-loading-error') }}
          </span>
        </div>
      </template>
      <div v-if="isLoadingPermissions" class="permission-form__loader-wrapper">
        <loader class="permission-form__loader" />
        <span class="permission-form__loader-text">
          {{ $t('permission-form.loader-text') }}
        </span>
      </div>
    </div>

    <div class="permission-form__actions">
      <app-button
        class="permission-form__submit-btn"
        size="medium"
        modification="border-rounded"
        scheme="flat"
        :text="$t('permission-form.cancel-btn')"
        :disabled="isFormDisabled"
        @click="cancelForm"
      />
      <app-button
        class="permission-form__submit-btn"
        size="medium"
        modification="border-rounded"
        scheme="filled"
        type="submit"
        :text="$t('permission-form.submit-btn')"
        :disabled="!isFieldsValid"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import { AppButton, Loader, Icon } from '@/common'
import { api } from '@/api'
import { InputField, SelectField } from '@/fields'
import { useContext, useForm, useFormValidation } from '@/composables'
import { maxLength, required, email } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import {
  ModulePermissionsResponse,
  UserPermissionInfo,
  ModulePermissions,
} from '@/types'
import { useAuthStore, usePlatformStore } from '@/store'
import { storeToRefs } from 'pinia'
import { MAX_LENGTH, MODULES } from '@/enums'
import { requiredIf } from '@vuelidate/validators'
import { debounce } from 'lodash-es'

const DEBOUNCE_TIMEOUT = 2000 //ms

const props = withDefaults(
  defineProps<{
    id: string
    module?: UserPermissionInfo
    moduleName?: string
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
const { currentUserId } = useAuthStore()
const isLoadingPermissions = ref(false)
const isLoadingPermissionsError = ref(false)
const isAccessLevelRequired = ref(false)
const accessList = ref<ModulePermissions[]>([])
const modulesNames = computed(() => modules.value.map(item => item.name))
const accessNameList = computed(() => accessList.value.map(item => item.name))
const isEditForm = computed(() => Boolean(props.module))

const prefix = computed(
  () => modules.value.find(el => el.id === form.module.toLowerCase())?.prefix,
)

const isUsernameInputDisabled = computed(() => Boolean(form.phoneNumber))

const isPhoneInputDisabled = computed(() => Boolean(form.username))

const moduleId = computed(
  () => modules.value.find(el => el.name === form.module)?.id,
)

const isEmailModule = computed(() => moduleId.value === MODULES.email)

const isTelegramModule = computed(() => moduleId.value === MODULES.telegram)

// TODO: EDIT WHEN BACKEND WILL BE READY
const isModulePrefix = computed(() => prefix.value !== '+380')

const isAccessLevelCanBeChosen = computed(
  () => form.link && (form.username || form.phoneNumber),
)

const validationRules = computed(() => ({
  module: { required },
  link: { required: requiredIf(() => !isEmailModule.value) },
  username: {
    required: requiredIf(
      () => !isEmailModule.value && !isUsernameInputDisabled.value,
    ),
  },
  accessLevel: {
    required: requiredIf(
      () => isAccessLevelRequired.value || !isEmailModule.value,
    ),
  },
  phoneNumber: {
    required: requiredIf(
      () =>
        !isModulePrefix.value &&
        !isPhoneInputDisabled.value &&
        !isEmailModule.value,
    ),
  },
  name: {
    maxLength: maxLength(MAX_LENGTH.name),
    required: requiredIf(() => isEmailModule.value),
  },
  surname: {
    maxLength: maxLength(MAX_LENGTH.surname),
    required: requiredIf(() => isEmailModule.value),
  },
  email: { email, required: requiredIf(() => isEmailModule.value) },
}))

const form = reactive({
  module: props.moduleName ?? '',
  username: props.module?.username ?? '',
  link: props.module?.link ?? '',
  accessLevel: '',
  phoneNumber: props.module?.phone ?? '',
  name: '',
  surname: '',
  email: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const {
  isFormValid,
  getFieldErrorMessage,
  touchField,
  isFieldsValid,
  cleanErrors,
} = useFormValidation(form, validationRules)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    const accessLevelValue = accessList.value
      ? accessList.value.find(item => item.name === form.accessLevel)
      : props.module.access_level
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: form.module.toLowerCase(),
          from_user: String(currentUserId),
          to_user: String(props.id),
          payload: {
            action: isEditForm.value ? 'update_user' : 'add_user',
            user_id: String(props.id),
            link: form.link,
            access_level: accessLevelValue?.value,
            ...(form.username ? { username: form.username } : {}),
            ...(form.phoneNumber
              ? { phone: prefix.value + form.phoneNumber.split(' ').join('') }
              : {}),
            ...(form.name ? { name: form.name } : {}),
            ...(form.surname ? { surname: form.surname } : {}),
            ...(form.email ? { email: form.email } : {}),
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

    Bus.info($t('permission-form.success-msg'))
    emit('submit')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}

const cancelForm = () => {
  emit('cancel')
}

const clearForm = () => {
  form.username = ''
  form.link = ''
  form.accessLevel = ''
  form.phoneNumber = ''
  form.name = ''
  form.surname = ''
  form.email = ''
  accessList.value = []
  cleanErrors()
}

const getAccessLevelList = async () => {
  if (!isAccessLevelCanBeChosen.value || !form.module || !form.link) return
  isLoadingPermissions.value = true
  isLoadingPermissionsError.value = false
  try {
    isAccessLevelRequired.value = false
    accessList.value = []
    const { data } = await api.get<ModulePermissionsResponse>(
      `/integrations/${moduleId.value}/get_available_roles`,
      {
        filter: {
          link: form.link,
          ...(form.username ? { username: form.username } : {}),
          ...(form.phoneNumber
            ? { phone: prefix.value + form.phoneNumber.split(' ').join('') }
            : {}),
        },
      },
    )
    isAccessLevelRequired.value = data.req
    accessList.value = data.list

    if (isTelegramModule.value && accessList.value.length) {
      form.accessLevel = accessList.value[0].name
    }

    if (props.module) {
      const currentAccessLevel = accessList.value
        ? accessList.value.find(
            item => item.value === props.module.access_level.value,
          )
        : props.module.access_level
      form.accessLevel = currentAccessLevel?.name ?? ''
    }
  } catch (e) {
    isLoadingPermissionsError.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoadingPermissions.value = false
}

const deboucedAccessList = debounce(
  async () => await getAccessLevelList(),
  DEBOUNCE_TIMEOUT,
)

watch([() => form.link, () => form.phoneNumber, () => form.username], () => {
  deboucedAccessList()
})

watch(moduleId, clearForm)

getAccessLevelList()
</script>

<style lang="scss" scoped>
.permission-form {
  width: 100%;
}

.permission-form__field-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.permission-form__field {
  display: flex;
  flex-direction: column;
  gap: toRem(6);
  width: 100%;
}

.permission-form__field-title {
  font-size: toRem(14);
  font-weight: 500;
}

.permission-form__submit-btn {
  width: 100%;
}

.permission-form__actions {
  display: flex;
  gap: toRem(16);
}

.permission-form__origin {
  padding-right: toRem(8);
  border-right: toRem(1) solid var(--border-primary-main);
}

.permission-form__origin-text {
  line-height: 1.2;
  color: var(--text-secondary-light);
}

.permission-form__field-input {
  &--phone {
    &:deep(.input-field__input) {
      padding-left: toRem(70);
    }
  }

  &--github {
    &:deep(.input-field__input) {
      padding-left: toRem(190);
    }
  }

  &--gitlab {
    &:deep(.input-field__input) {
      padding-left: toRem(185);
    }
  }
}

.permission-form__field-select {
  &:deep(.select-field__select-dropdown) {
    max-height: toRem(250);
  }
}

.permission-form__field-access-select {
  &:deep(.select-field__select-dropdown) {
    max-height: toRem(80);
  }
}

.permission-form__loader-wrapper {
  display: flex;
  gap: toRem(10);
  align-items: center;
}

.permission-form__loader {
  width: toRem(20);
  height: toRem(20);

  &:deep(.spinner) {
    width: toRem(20);
    height: toRem(20);

    &:after {
      width: toRem(20);
      height: toRem(20);
      border-width: toRem(2);
      margin: 0;
    }
  }
}

.permission-form__loader-text {
  font-size: toRem(14);
  color: var(--text-primary-light);
}

.permission-form__loading-error-text {
  color: var(--error-main);
  font-size: toRem(14);
  line-height: 1.2;
}

.permission-form__loading-modules-info {
  padding: toRem(24) 0;
}

.permission-form__loading-error {
  display: flex;
  align-items: center;
  gap: toRem(10);
  border-radius: toRem(12);
  padding: toRem(16);
  background: var(--background-primary-dark);
}

.permission-form__loading-error-icon {
  max-width: toRem(15);
  max-height: toRem(15);
  color: var(--error-main);
}
</style>
