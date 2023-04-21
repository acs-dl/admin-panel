<template>
  <div class="no-data-message">
    <icon class="no-data-message__icon" :name="iconName" />
    <h3 v-if="title" class="no-data-message__title">
      {{ title }}
    </h3>
    <span v-if="message" class="no-data-message__message">
      {{ message }}
    </span>
    <template v-if="$slots.default">
      <div class="no-data-message__slot-wrapper">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    message?: string
    title?: string
    iconName?: ICON_NAMES
  }>(),
  {
    message: '',
    title: '',
    iconName: ICON_NAMES.noData,
  },
)
</script>

<style lang="scss" scoped>
.no-data-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(10);
}

.no-data-message__icon {
  width: toRem(300);
  height: toRem(250);
  color: var(--background-primary-light);
}

.no-data-message__message {
  font-weight: 500;
  font-size: toRem(14);
  color: var(--text-secondary-light);
}

.no-data-message__title {
  font-weight: 500;
  font-size: toRem(18);
  color: var(--text-secondary-light);
}

.no-data-message__slot-wrapper {
  margin-top: toRem(10);
}
</style>
