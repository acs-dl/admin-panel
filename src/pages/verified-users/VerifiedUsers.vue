<template>
  <div class="verified-users">
    <div class="verified-users__title-wrapper">
      <h2 class="verified-users__title">
        {{ $t('verified-users.main-title') }}
      </h2>
      <app-button
        class="verified-users__add-user-btn"
        size="medium"
        modification="border-rounded"
        scheme="filled"
        :text="$t('verified-users.add-user-btn')"
      />
    </div>
    <verified-users-list />
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import VerifiedUsersList from './components/VerifiedUsersList.vue'
</script>

<style scoped lang="scss">
.verified-users__title {
  font-size: toRem(24);
  font-weight: 700;
}

.verified-users__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
