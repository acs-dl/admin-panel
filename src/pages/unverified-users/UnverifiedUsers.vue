<template>
  <div class="unverified-users">
    <div class="unverified-users__title-wrapper">
      <h2 class="unverified-users__title">
        {{ $t('unverified-users.main-title') }}
      </h2>
      <app-button
        class="unverified-users__add-user-btn"
        size="medium"
        modification="border-rounded"
        scheme="filled"
        :text="$t('unverified-users.add-user-btn')"
      />
    </div>
    <unverified-users-list />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import UnverifiedUsersList from './components/UnverifiedUsersList.vue'
</script>

<style scoped lang="scss">
.unverified-users__title {
  font-size: toRem(24);
  font-weight: 700;
}

.unverified-users__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
