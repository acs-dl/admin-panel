<template>
  <div class="login-page">
    <div class="login-page__header">
      <div class="login-page__logo-wrapper">
        <icon class="login-page__logo-icon" :name="$icons.appLogo" />
        <h4 class="login-page__header-text">
          {{ $t('login-page.logo-text') }}
        </h4>
      </div>
      <h4 class="login-page__header-text login-page__header-text--title">
        {{ $t('login-page.header-title') }}
      </h4>
    </div>
    <div class="login-page__form-wrapper">
      <div class="login-page__form-header">
        {{ $t('login-page.login-title') }}
      </div>
      <login-form />
    </div>
    <h4 class="login-page__header-text login-page__header-text--footer">
      {{ $t('login-page.header-title') }}
    </h4>
  </div>
</template>

<script lang="ts" setup>
import { LoginForm } from '@/forms'
import { Icon } from '@/common'
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;
  background: url('@static/images/login-page-background.png');
  background-size: 100%;

  @include respond-to(small) {
    height: 100vh;
    flex-direction: column;
    align-items: center;
  }
}

.login-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: 400;
  font-size: toRem(45);
  margin-top: toRem(40);
  color: var(--primary-dark);
  gap: toRem(24);

  @include respond-to(small) {
    justify-content: center;
    margin-top: toRem(32);
  }
}

.login-page__logo-icon {
  width: toRem(48);
  height: toRem(48);

  @include respond-to(tablet) {
    width: toRem(32);
    height: toRem(32);
  }

  @include respond-to(small) {
    width: toRem(28);
    height: toRem(28);
  }
}

.login-page__logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: toRem(16);
}

.login-page__header-text {
  font-size: toRem(20);
  font-weight: 600;

  &--footer {
    display: none;
  }

  @include respond-to(tablet) {
    font-size: toRem(16);
  }

  @include respond-to(small) {
    font-size: toRem(14);

    &--title {
      display: none;
    }

    &--footer {
      display: inline;
      margin-top: auto;
      margin-bottom: toRem(32);
    }
  }
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
  font-size: toRem(32);
  font-weight: 600;
  margin-bottom: toRem(32);
}
</style>
