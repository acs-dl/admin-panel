<template>
  <form class="login-form" @submit.prevent="submit">
    <input-field
      v-model="form.login"
      :placeholder="$t('login-form.login-lbl')"
      :error-message="getFieldErrorMessage('login')"
      :disabled="isFormDisabled"
      @blur="touchField('login')"
    />
    <input-field
      type="password"
      v-model="form.password"
      :placeholder="$t('login-form.password-lbl')"
      :error-message="getFieldErrorMessage('password')"
      :disabled="isFormDisabled"
      @blur="touchField('password')"
    />
    <div class="login-form__actions">
      <app-button
        class="login-form__submit-btn"
        size="large"
        modification="border-rounded"
        scheme="filled"
        type="submit"
        :text="$t('login-form.submit-btn')"
        :disabled="isFormDisabled"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { AppButton } from '@/common'
import { InputField } from '@/fields'
import { useForm, useFormValidation } from '@/composables'
import { email, required } from '@/validators'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { ErrorHandler } from '@/helpers'
import { useAuthStore } from '@/store'

const form = reactive({
  login: '',
  password: '',
})

const { isFormDisabled, disableForm, enableForm } = useForm()

const { isFormValid, getFieldErrorMessage, touchField } = useFormValidation(
  form,
  {
    login: { email, required },
    password: { required },
  },
)
const authStore = useAuthStore()

const submit = async () => {
  if (!isFormValid()) return

  disableForm()
  try {
    await authStore.createSession(form.login, form.password)
    router.push({ name: ROUTE_NAMES.verifiedUsers })
  } catch (error) {
    ErrorHandler.process(error)
  }
  enableForm()
}
</script>

<style lang="scss" scoped>
.login-form {
  display: grid;
  grid-gap: toRem(24);
  max-width: toRem(430);
  width: 100%;
}

.login-form__submit-btn {
  width: 100%;
}
</style>
