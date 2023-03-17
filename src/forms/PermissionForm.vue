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
      <div class="permission-form__field">
        <h5 class="permission-form__field-title">
          {{ $t('permission-form.link-lbl') }}
        </h5>
        <input-field
          v-model="form.link"
          scheme="secondary"
          class="permission-form__field-input"
          :class="`permission-form__field-input--${moduleId}`"
          :placeholder="$t('permission-form.link-lbl')"
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

      <div
        v-if="accessList.length && isAccessLevelRequired"
        class="permission-form__field"
      >
        <h5 class="permission-form__field-title">
          {{ $t('permission-form.access-level-lbl') }}
        </h5>
        <select-field
          v-model="form.accessLevel"
          scheme="secondary"
          class="permission-form__field-select"
          :value-options="accessNameList"
          :placeholder="$t('permission-form.access-level-placeholder')"
          :error-message="getFieldErrorMessage('accessLevel')"
          :disabled="isFormDisabled"
          @blur="touchField('accessLevel')"
        />
      </div>

      <div class="permission-form__field">
        <h5 class="permission-form__field-title">
          {{ usernameTitle }}
        </h5>
        <input-field
          v-model="form.username"
          scheme="secondary"
          class="permission-form__field-input"
          :placeholder="usernameTitle"
          :error-message="getFieldErrorMessage('username')"
          :disabled="isFormDisabled || isEditForm"
          @blur="touchField('username')"
        />
      </div>
    </div>

    <div class="permission-form__actions">
      <app-button
        class="permission-form__submit-btn"
        size="large"
        modification="border-rounded"
        scheme="flat"
        :text="$t('permission-form.cancel-btn')"
        :disabled="isFormDisabled"
        @click="cancelForm"
      />
      <app-button
        class="permission-form__submit-btn"
        size="large"
        modification="border-rounded"
        scheme="filled"
        type="submit"
        :text="$t('permission-form.submit-btn')"
        :disabled="isFormDisabled"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, watch, ref } from 'vue'
import { AppButton } from '@/common'
import { api } from '@/api'
import { InputField, SelectField } from '@/fields'
import { useContext, useForm, useFormValidation } from '@/composables'
import { required } from '@/validators'
import { Bus, ErrorHandler } from '@/helpers'
import {
  ModulePermissionsResponse,
  UserPermissionInfo,
  ModulePermissions,
} from '@/types'
import { debounce } from 'lodash-es'
import { useAuthStore, usePlatformStore } from '@/store'
import { storeToRefs } from 'pinia'

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
const isAccessLevelRequired = ref(false)
const accessList = ref<ModulePermissions[]>([])
const modulesNames = computed(() => modules.value.map(item => item.name))
const accessNameList = computed(() => accessList.value.map(item => item.name))
const isEditForm = computed(() => Boolean(props.module))
const prefix = computed(
  () => modules.value.find(el => el.id === form.module.toLowerCase())?.prefix,
)

const moduleId = computed(() => props.module.id || props.moduleName)

// TODO: EDIT WHEN BACKEND WILL BE READY
const isModulePrefix = computed(() => prefix.value !== '+')

const usernameTitle = computed(() =>
  isModulePrefix.value
    ? $t('permission-form.username-lbl')
    : $t('permission-form.username-or-phone-lbl'),
)

const form = reactive({
  module: props.moduleName ?? '',
  username: props.module?.username ?? '',
  link: props.module?.link ?? '',
  accessLevel: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    module: { required },
    link: { required },
    username: { required },
    accessLevel: isAccessLevelRequired.value ? { required } : {},
  },
)

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    const accessLevelValue = accessList.value.find(
      item => item.name === form.accessLevel,
    )
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: form.module.toLowerCase(),
          from_user: String(currentUserId),
          to_user: String(props.id),
          payload: {
            action: isEditForm.value ? 'update_user' : 'add_user',
            user_id: String(props.id),
            username: form.username,
            link: form.link,
            access_level: accessLevelValue?.value,
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

const getAccessLevelList = async () => {
  try {
    if (!form.module || !form.link) return
    isAccessLevelRequired.value = false
    accessList.value = []
    const { data } = await api.get<ModulePermissionsResponse>(
      `/integrations/${form.module.toLowerCase()}/get_available_roles`,
      {
        filter: {
          link: form.link,
          username: form.username,
        },
      },
    )
    isAccessLevelRequired.value = data.req
    accessList.value = data.list

    if (props.module) {
      const currentAccessLevel = accessList.value.find(
        item => item.value === props.module.access_level.value,
      )
      form.accessLevel = currentAccessLevel?.name ?? ''
    }
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const loadAccessLevelList = debounce(getAccessLevelList, 200)

watch(
  () => [form.module, form.link],
  async () => {
    if (props.module) {
      disableForm()
      await getAccessLevelList()
      enableForm()
      return
    }
    loadAccessLevelList()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.permission-form {
  display: grid;
  grid-gap: toRem(24);
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
  color: var(--border-primary-main);
}

.permission-form__field-input {
  &--github {
    &:deep(.input-field__input) {
      padding-left: toRem(180);
    }
  }

  &--gitlab {
    &:deep(.input-field__input) {
      padding-left: toRem(175);
    }
  }
}
</style>
