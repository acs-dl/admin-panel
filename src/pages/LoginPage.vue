<template>
  <div class="login-page">
    <div class="login-page__header">
      {{ $t('login-page.header-title') }}
    </div>
    <div class="login-page__form-wrapper">
      <div class="login-page__form-header">
        {{ $t('login-page.login-title') }}
      </div>
      <login-form />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '@/forms/LoginForm.vue'
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;

  @include respond-to(small) {
    height: 100vh;
    flex-direction: column;
    align-items: center;
  }
}

.login-page__header {
  font-weight: 400;
  font-size: toRem(45);
  margin-top: toRem(40);
  color: var(--primary-dark);
}

.login-page__form-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;

  @include respond-to(small) {
    width: 100%;
  }
}

.login-page__form-header {
  font-size: toRem(40);
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: toRem(40);
  color: var(--text-primary-main);
}
</style>
