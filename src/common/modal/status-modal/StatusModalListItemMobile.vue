<template>
  <div class="status-modal-list-item-mobile">
    <app-accordion class="status-modal-list-item-mobile__accordion">
      <template #head="{ accordion }">
        <app-button
          class="status-modal-list-item-mobile__accordion-button"
          :class="{
            'status-modal-list-item-mobile__accordion-button--opened':
              accordion.isOpen,
          }"
          @click="accordion.toggle"
        >
          <img
            class="status-modal-list-item-mobile__icon"
            :src="iconLink"
            :alt="$t('status-modal-list-item.icon-description')"
          />
          <span class="status-modal-list-item-mobile__username">
            {{ request.payload.username || request.payload.phone }}
          </span>
          <div
            class="status-modal-list-item-mobile__status"
            :class="`status-modal-list-item-mobile__status--${statusModifier}`"
          >
            <icon
              class="status-modal-list-item-mobile__status-icon"
              :name="requestStatusIcon"
            />
          </div>
          <icon
            class="status-modal-list-item-mobile__name-icon"
            :class="{
              'status-modal-list-item-mobile__name-icon--open':
                accordion.isOpen,
            }"
            :name="$icons.chevronFullRight"
          />
        </app-button>
      </template>
      <div class="status-modal-list-item-mobile__accordion-body">
        <div
          v-for="(item, idx) in accordionBody"
          :key="idx"
          class="status-modal-list-item-mobile__accordion-body-item"
        >
          <span class="status-modal-list-item-mobile__desc">
            {{ item.desc }}
          </span>
          <span class="status-modal-list-item-mobile__info">
            {{ item.info }}
          </span>
        </div>
      </div>
    </app-accordion>
  </div>
</template>

<script lang="ts" setup>
import { Icon, AppButton, AppAccordion } from '@/common'
import { usePlatformStore } from '@/store'
import { UserRequest } from '@/types'
import { computed } from 'vue'
import { ICON_NAMES, REQUEST_STATUSES } from '@/enums'
import { formatMDY } from '@/helpers'
import { useContext } from '@/composables'

const props = defineProps<{
  request: UserRequest
}>()

const { $t } = useContext()
const { modules, roles } = usePlatformStore()

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

const accordionBody = computed(() => [
  {
    desc: $t('status-modal-list-item-mobile.submodule-text'),
    info: module.value,
  },
  {
    desc: $t('status-modal-list-item-mobile.access-level-text'),
    info: accessLevel.value,
  },
  {
    desc: $t('status-modal-list-item-mobile.date-text'),
    info: formatMDY(props.request.created_at),
  },
])

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
</script>

<style lang="scss" scoped>
.status-modal-list-item-mobile {
  display: flex;
  gap: toRem(8);
  background: var(--background-primary-dark);
  border-radius: toRem(8);
  align-items: center;
  width: 100%;
}

.status-modal-list-item-mobile__accordion {
  width: toRem(400);

  @include respond-to(small) {
    width: 100%;
  }
}

.status-modal-list-item-mobile__accordion-button {
  display: grid;
  padding: toRem(12);
  grid-template-columns: toRem(30) minmax(toRem(100), 1fr) toRem(30) toRem(30);
  gap: toRem(10);
  width: 100%;

  &--opened {
    padding-bottom: toRem(12);
    border-bottom: toRem(1) solid var(--border-primary-light);

    &:not([disabled]):hover,
    &:not([disabled]):active,
    &:not([disabled]):focus {
      padding-bottom: toRem(12);
      border-bottom: toRem(1) solid var(--border-primary-light);
    }
  }
}

.status-modal-list-item-mobile__icon {
  width: toRem(30);
  height: toRem(30);
}

.status-modal-list-item-mobile__info {
  color: var(--text-secondary-light);
  line-height: 1.2;
  font-size: toRem(14);

  @include text-ellipsis;
}

.status-modal-list-item-mobile__status {
  position: relative;
  padding: toRem(6);
  border-radius: 50%;
  flex: 1;
  margin-left: auto;

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

.status-modal-list-item-mobile__status-icon {
  max-width: toRem(17);
  max-height: toRem(17);
}

.status-modal-list-item-mobile__status-text {
  text-transform: capitalize;
}

.status-modal-list-item-mobile__username {
  text-align: left;
  font-size: toRem(14);
  font-weight: 400;
}

.status-modal-list-item-mobile__name-icon {
  max-width: toRem(7);
  max-height: toRem(7);
  margin: 0 auto;
  color: var(--text-primary-main);
  transition: linear 0.1s;
  transform: rotate(90deg);

  &--open {
    transform: rotate(-90deg);
  }
}

.status-modal-list-item-mobile__accordion-body {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
  padding: toRem(12);
}

.status-modal-list-item-mobile__accordion-body-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: toRem(10);
}

.status-modal-list-item-mobile__desc {
  font-weight: 400;
  font-size: toRem(14);
  color: var(--text-primary-light);
}
</style>
