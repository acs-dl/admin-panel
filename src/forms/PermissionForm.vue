<template>
  <form class="permission-form" @submit.prevent="submit">
    <div class="permission-form__field-wrapper">
      <div class="permission-form__field">
        <h5 class="permission-form__field-title">
          {{ $t('permission-form.module-lbl') }}
        </h5>
        <select-field
          v-if="!isEditForm"
          v-model="form.module"
          scheme="secondary"
          class="permission-form__field-select"
          :value-options="MODULES"
          :placeholder="$t('permission-form.module-placeholder')"
          :error-message="getFieldErrorMessage('module')"
          @blur="touchField('module')"
        />
        <div v-else>
          {{ form.module }}
        </div>
      </div>
      <div class="permission-form__field">
        <h5 class="permission-form__field-title">
          {{ $t('permission-form.link-lbl') }}
        </h5>
        <input-field
          v-if="!isEditForm"
          v-model="form.link"
          scheme="secondary"
          class="permission-form__field-input"
          :placeholder="$t('permission-form.link-lbl')"
          :error-message="getFieldErrorMessage('link')"
          :disabled="isFormDisabled"
          @blur="touchField('link')"
        />
        <div v-else>
          {{ form.link }}
        </div>
      </div>

      <div class="permission-form__field">
        <h5 class="permission-form__field-title">
          {{ $t('permission-form.username-lbl') }}
        </h5>
        <input-field
          v-if="!isEditForm"
          v-model="form.username"
          scheme="secondary"
          class="permission-form__field-input"
          :placeholder="$t('permission-form.username-lbl')"
          :error-message="getFieldErrorMessage('username')"
          :disabled="isFormDisabled"
          @blur="touchField('username')"
        />
        <div v-else>
          {{ form.username }}
        </div>
      </div>

      <div class="permission-form__field">
        <h5 class="permission-form__field-title">
          {{ $t('permission-form.access-level-lbl') }}
        </h5>
        <select-field
          v-model="form.accessLevel"
          scheme="secondary"
          class="permission-form__field-select"
          :value-options="POSITIONS"
          :placeholder="$t('permission-form.position-placeholder')"
          :error-message="getFieldErrorMessage('accessLevel')"
          @blur="touchField('accessLevel')"
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
import { reactive, computed } from 'vue'
import { AppButton } from '@/common'
import { api } from '@/api'
import { InputField, SelectField } from '@/fields'
import { useForm, useFormValidation } from '@/composables'
import { required } from '@/validators'
import { POSITIONS, MODULES } from '@/consts'
import { ErrorHandler } from '@/helpers'

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    module?: any // fix
    id: string
  }>(),
  {
    module: undefined,
  },
)

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
}>()

const form = reactive({
  module: props.module.module ?? '',
  username: props.module?.username ?? '',
  link: props.module?.link ?? '',
  accessLevel: props.module?.link ?? '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    module: { required },
    link: { required },
    username: { required },
    accessLevel: { required },
  },
)

const isEditForm = computed(() => props.module)

const cancelForm = () => {
  emit('cancel')
}

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: form.module,
          payload: {
            action: isEditForm.value ? 'update_user' : 'add_user',
            user_id: props.id,
            username: form.username,
            link: form.link,
            access_level: form.accessLevel,
          },
        },
        relationships: {
          user: {
            data: {
              id: props.id,
            },
          },
        },
      },
    })

    emit('submit')
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
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
</style>
