<template>
  <div class="refresh-estimate">
    <icon class="refresh-estimate__icon" :name="$icons.boldInfoCircle" />
    <div class="refresh-estimate__info-wrapper">
      <span class="refresh-estimate__info">
        {{ $t('refresh-estimate.update-text') }}
      </span>
      <i18n-t
        v-if="isTimeShown"
        class="refresh-estimate__info"
        tag="span"
        keypath="refresh-estimate.estimate-text"
      >
        <template #estimate>
          <span
            :class="['refresh-estimate__info', 'refresh-estimate__info--bold']"
          >
            {{ estimate }}
          </span>
        </template>
      </i18n-t>
      <span v-else class="refresh-estimate__info">
        {{ $t('refresh-estimate.no-estimate-text') }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

defineProps<{
  estimate: string
  isTimeShown: boolean
}>()
</script>

<style lang="scss" scoped>
.refresh-estimate {
  display: flex;
  padding: toRem(16);
  gap: toRem(10);
  align-items: center;
  border-radius: toRem(12);
  background: var(--background-primary-dark);
}

.refresh-estimate__icon {
  max-width: toRem(17);
  max-height: toRem(17);
  color: var(--primary-main);
}

.refresh-estimate__info-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(6);
}

.refresh-estimate__info {
  font-size: toRem(14);
  font-weight: 400;

  &--bold {
    font-weight: 600;
  }

  @include respond-to(xsmall) {
    font-size: toRem(12);
  }
}
</style>
