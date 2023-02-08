<template>
  <div class="status-modal-list-item">
    <img
      class="status-modal-list-item__icon"
      :src="iconLink"
      :alt="$t('status-modal-list-item.icon-description')"
    />
    <span class="status-modal-list-item__username">
      {{ request.payload.username }}
    </span>
    <span class="status-modal-list-item__info">
      {{ module }}
    </span>
    <span class="status-modal-list-item__info">
      {{ accessLevel }}
    </span>
    <span class="status-modal-list-item__info">
      {{ request.payload.username }}
    </span>
    <div
      class="status-modal-list-item__status-wrapper"
      :class="`status-modal-list-item__status-wrapper--${request.status}`"
    >
      <span class="status-modal-list-item__status-text">
        {{ request.status }}
      </span>
      <icon
        class="status-modal-list-item__status-icon"
        :name="requestStatusIcon"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { usePlatformStore } from '@/store'
import { UserRequest } from '@/types'
import { ICON_NAMES, REQUEST_STATUSES } from '@/enums'
import { Icon } from '@/common'

const { modules } = usePlatformStore()

const props = defineProps<{
  request: UserRequest
}>()

const iconLink = computed(() => {
  const foundModule = modules.find(el => el.name === props.request.module)
  return foundModule ? foundModule.icon : ''
})

const module = computed(() => props.request.payload?.link || '-')

const accessLevel = computed(() => props.request.payload?.access_level || '-')

const requestStatusIcon = computed(() => {
  const status = props.request.status
  if (status === REQUEST_STATUSES.finished) return ICON_NAMES.check
  if (status === REQUEST_STATUSES.created)
    return ICON_NAMES.dotsCircleHorizontal
  if (status === REQUEST_STATUSES.failed) return ICON_NAMES.exclamationCircle
  return ICON_NAMES.loading
})
</script>

<style lang="scss" scoped>
.status-modal-list-item {
  display: grid;
  grid-template-columns:
    toRem(80) minmax(toRem(100), 2fr) minmax(toRem(100), 2fr)
    minmax(toRem(130), 1fr) minmax(toRem(100), 1fr) minmax(toRem(110), 1fr);
  padding: toRem(32) 0;
  background: var(--background-primary-dark);
  border-radius: toRem(8);
  gap: toRem(10);
  align-items: center;
}

.status-modal-list-item__icon {
  width: toRem(30);
  height: toRem(30);
  margin-left: toRem(32);
}

.status-modal-list-item__info {
  color: var(--text-secondary-light);

  @include text-ellipsis;
}

.status-modal-list-item__status-wrapper {
  display: grid;
  width: fit-content;
  grid-template-columns: minmax(toRem(20), 1fr) toRem(13);
  gap: toRem(9);
  padding: toRem(8) toRem(10);
  border-radius: toRem(20);
  align-items: center;

  &--failed {
    background: var(--error-light);
    color: var(--error-main);
  }

  &--pending {
    background: var(--warning-light);
    color: var(--warning-main);
  }

  &--created {
    background: var(--info-light);
    color: var(--info-main);
  }

  &--finished {
    background: var(--success-light);
    color: var(--success-main);
  }
}

.status-modal-list-item__status-icon {
  max-width: toRem(13);
  height: toRem(13);
}

.status-modal-list-item__status-text {
  text-transform: capitalize;
}
</style>
