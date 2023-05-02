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
      {{ requestAction }}
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
import { Icon, AppTooltip } from '@/common'
import { usePlatformStore } from '@/store'
import { UserRequest } from '@/types'
import { computed, ref } from 'vue'
import { ICON_NAMES, REQUEST_STATUSES, USER_REQUEST_STATUSES } from '@/enums'
import { formatMDY } from '@/helpers'
import { useContext } from '@/composables'

const { modules } = usePlatformStore()

const props = defineProps<{
  request: UserRequest
}>()

const { $t } = useContext()

const isTooltipShown = ref(false)

const currentModule = computed(() =>
  modules.find(el => el.id === props.request.module),
)

const iconLink = computed(() => currentModule.value?.icon ?? '')

const requestedSubmoduleLink = computed(() => props.request.payload?.link)

const statusModifier = computed(() => props.request.status.split(' ').join('-'))

const infoMessageAboutModule = computed(
  () => requestedSubmoduleLink.value || currentModule.value?.name || '-',
)

const requestAction = computed(() => {
  switch (props.request.payload?.action) {
    case USER_REQUEST_STATUSES.removeUser:
      return $t('status-modal-list-item.removing-request', {
        submodule: infoMessageAboutModule.value,
      })
    case USER_REQUEST_STATUSES.addUser:
      return $t('status-modal-list-item.adding-request', {
        submodule: infoMessageAboutModule.value,
      })
    case USER_REQUEST_STATUSES.updateUser:
      return $t('status-modal-list-item.updating-request', {
        submodule: infoMessageAboutModule.value,
      })
    case USER_REQUEST_STATUSES.deleteUser:
      return $t('status-modal-list-item.deleting-request', {
        submodule: infoMessageAboutModule.value,
      })
    case USER_REQUEST_STATUSES.verifyUser:
      return $t('status-modal-list-item.verifying-request', {
        submodule: infoMessageAboutModule.value,
      })
    default:
      return '-'
  }
})

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
    toRem(80) minmax(toRem(100), toRem(200)) minmax(toRem(100), 3fr)
    minmax(toRem(100), 1fr) minmax(toRem(145), 1fr);
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
