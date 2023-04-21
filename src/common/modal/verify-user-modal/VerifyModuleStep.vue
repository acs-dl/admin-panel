<template>
  <div class="verify-module-step">
    <div class="verify-module-step__icon-wrapper">
      <icon class="verify-module-step__icon" :name="$icons.verified" />
    </div>
    <div class="verify-module-step__title-wrapper">
      <h2 class="verify-module-step__title">
        {{
          $t('verify-module-step.title', {
            username: $filter.username(user.username),
          })
        }}
      </h2>
      <h3 class="verify-module-step__title-secondary">
        {{ $t('verify-module-step.subtitle') }}
      </h3>
    </div>
    <div class="verify-module-step__list-header">
      <span class="verify-module-step__list-header-text">
        {{ $t('verify-module-step.list-header-module-text') }}
      </span>
      <span class="verify-module-step__list-header-text">
        {{ $t('verify-module-step.list-header-submodule-text') }}
      </span>
    </div>
    <div class="verify-module-step__list">
      <verify-module-item
        v-for="(module, idx) in user.module"
        :key="idx"
        :current-module="module"
        :user="user"
        @verify-module="emit('verify', $event)"
        @delete-module="emit('delete', $event)"
      />
    </div>
    <app-button
      class="verify-module-step__cancel-button"
      :text="$t('verify-module-step.cancel-button')"
      size="medium"
      modification="border-rounded"
      scheme="flat"
      @click="emit('cancel')"
    />
  </div>
</template>

<script lang="ts" setup>
import { Icon, AppButton } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import VerifyModuleItem from '@/common/modal/verify-user-modal/VerifyModuleItem.vue'

defineProps<{
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'verify', value: string): void
  (e: 'delete', value: string): void
}>()
</script>

<style lang="scss" scoped>
.verify-module-step {
  width: toRem(600);

  @include respond-to(medium) {
    width: 100%;
  }
}

.verify-module-step__icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: toRem(48);
  height: toRem(48);
  border: toRem(1) solid var(--border-primary-light);
  border-radius: toRem(10);
  margin-bottom: toRem(12);
}

.verify-module-step__icon {
  width: toRem(24);
}

.verify-module-step__title-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  margin-bottom: toRem(12);
}

.verify-module-step__title {
  font-weight: 600;
  font-size: toRem(18);
  margin-bottom: toRem(4);
}

.verify-module-step__title-secondary {
  font-size: toRem(14);
  font-weight: 400;
  color: var(--text-secondary-light);
}

.verify-module-step__list-header {
  display: grid;
  grid-template-columns: toRem(100) minmax(toRem(80), 1fr);
  margin-top: toRem(24);

  @include respond-to(medium) {
    grid-template-columns: toRem(75) minmax(toRem(100), 1fr);
  }
}

.verify-module-step__list-header-text {
  font-size: toRem(15);
  font-weight: 500;
}

.verify-module-step__cancel-button {
  width: 100%;
  margin-top: toRem(24);
}
</style>
