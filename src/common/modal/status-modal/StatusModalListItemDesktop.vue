<template>
  <div class="status-modal-list-item-desktop">
    <img
      class="status-modal-list-item-desktop__icon"
      :src="iconLink"
      :alt="$t('status-modal-list-item.icon-description')"
    />
    <span class="status-modal-list-item-desktop__username">
      {{ request.payload.username || request.payload.phone }}
    </span>
    <span class="status-modal-list-item-desktop__info">
      {{ module }}
    </span>
    <span class="status-modal-list-item-desktop__info">
      {{ accessLevel }}
    </span>
    <span class="status-modal-list-item-desktop__info">
      {{ formatMDY(request.created_at) }}
    </span>
    <div
      class="status-modal-list-item-desktop__status"
      :class="`status-modal-list-item-desktop__status--${statusModifier}`"
      @mouseover="openTooltip"
      @mouseleave="closeTooltip"
    >
      <span class="status-modal-list-item-desktop__status-text">
        {{ request.status }}
      </span>
      <icon
        class="status-modal-list-item-desktop__status-icon"
        :name="requestStatusIcon"
      />
      <app-tooltip
        :is-shown="isTooltipShown"
        :message="request.error"
        @mouseover="openTooltip"
        @mouseleave="closeTooltip"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppTooltip, Icon } from '@/common'
import { usePlatformStore } from '@/store'
import { UserRequest } from '@/types'
import { computed, ref } from 'vue'
import { ICON_NAMES, REQUEST_STATUSES } from '@/enums'
import { formatMDY } from '@/helpers'

const { modules, roles } = usePlatformStore()

const props = defineProps<{
  request: UserRequest
}>()

const isTooltipShown = ref(false)

const iconLink = computed(
  () => modules.find(el => el.id === props.request.module)?.icon ?? '',
)

const module = computed(() => props.request.payload?.link || '-')

const statusModifier = computed(() => props.request.status.split(' ').join('-'))

const accessLevel = computed(() =>
  props.request.payload?.access_level && props.request.module
    ? roles[props.request.module][props.request.payload.access_level]
    : '-',
)

const requestStatusIcon = computed(() => {
  switch (props.request.status) {
    case REQUEST_STATUSES.success:
      return ICON_NAMES.check
    case REQUEST_STATUSES.inProgress:
      return ICON_NAMES.dotsCircleHorizontal
    case REQUEST_STATUSES.failed:
      return ICON_NAMES.exclamationCircle
    default:
      return ICON_NAMES.loading
  }
})

const openTooltip = () => {
  if (props.request.status === REQUEST_STATUSES.failed) {
    isTooltipShown.value = true
  }
}

const closeTooltip = () => {
  isTooltipShown.value = false
}
</script>

<style lang="scss" scoped>
.status-modal-list-item-desktop {
  display: grid;
  grid-template-columns:
    toRem(80) minmax(toRem(100), 2fr) minmax(toRem(100), 2fr)
    minmax(toRem(130), 1fr) minmax(toRem(100), 1fr) minmax(toRem(145), 1fr);
  padding: toRem(32) 0;
  background: var(--background-primary-dark);
  border-radius: toRem(8);
  gap: toRem(10);
  align-items: center;
}

.status-modal-list-item-desktop__icon {
  width: toRem(30);
  height: toRem(30);
  margin-left: toRem(32);
}

.status-modal-list-item-desktop__info {
  color: var(--text-secondary-light);
  line-height: 1.2;

  @include text-ellipsis;
}

.status-modal-list-item-desktop__status {
  position: relative;
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

  &--in-progress {
    background: var(--info-light);
    color: var(--info-main);
  }

  &--success {
    background: var(--success-light);
    color: var(--success-main);
  }
}

.status-modal-list-item-desktop__status-icon {
  max-width: toRem(13);
  height: toRem(13);
}

.status-modal-list-item-desktop__status-text {
  text-transform: capitalize;
}
</style>
