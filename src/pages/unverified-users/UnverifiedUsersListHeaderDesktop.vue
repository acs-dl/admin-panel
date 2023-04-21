<template>
  <div class="unverified-users-list-header-desktop">
    <div class="unverified-users-list-header-desktop__item">
      <span class="unverified-users-list-header-desktop__item-text">
        {{ $t('unverified-users-list.name-text') }}
      </span>
      <order-buttons
        class="unverified-users-list-header-desktop__order-buttons"
        :sorting-type-for-pick="UNVERIFIED_USER_SORTING_PARAMS.name"
        :order="currentOrder"
        :current-sorting-type="currentSortingType"
        @update:order="emit('update:currentOrder', $event)"
        @update:current-sorting-type="emit('update:currentSortingType', $event)"
      />
    </div>
    <div class="unverified-users-list-header-desktop__item">
      <span class="unverified-users-list-header-desktop__item-text">
        {{ $t('unverified-users-list.username-text') }}
      </span>
      <order-buttons
        class="unverified-users-list-header-desktop__order-buttons"
        :sorting-type-for-pick="UNVERIFIED_USER_SORTING_PARAMS.username"
        :order="currentOrder"
        :current-sorting-type="currentSortingType"
        @update:order="emit('update:currentOrder', $event)"
        @update:current-sorting-type="emit('update:currentSortingType', $event)"
      />
    </div>
    <div class="unverified-users-list-header-desktop__item">
      <span class="unverified-users-list-header-desktop__item-text">
        {{ $t('unverified-users-list.modules-text') }}
      </span>
    </div>
    <div class="unverified-users-list-header-desktop__item">
      <span class="unverified-users-list-header-desktop__item-text">
        {{ $t('unverified-users-list.date-text') }}
      </span>
      <order-buttons
        class="unverified-users-list-header-desktop__order-buttons"
        :sorting-type-for-pick="UNVERIFIED_USER_SORTING_PARAMS.createdAt"
        :order="currentOrder"
        :current-sorting-type="currentSortingType"
        @update:order="emit('update:currentOrder', $event)"
        @update:current-sorting-type="emit('update:currentSortingType', $event)"
      />
    </div>
    <!--TODO: EDIT SELECT LOGIC-->
    <select-field
      class="unverified-users-list-header-desktop__select-field"
      :model-value="currentModuleFilter"
      :value-options="moduleNames"
      @update:model-value="emit('update:currentModuleFilter', $event)"
    >
      <template #head="{ selectField }">
        <app-button color="blue" @click="selectField.toggle">
          <icon
            class="unverified-users-list-header-desktop__select-icon"
            :class="{
              'unverified-users-list-header-desktop__select-icon--opened':
                selectField.isOpen,
            }"
            :name="$icons.pyramid"
          />
          <span class="unverified-users-list-header-desktop__select-field-text">
            {{ $t('unverified-users-list.select-field-btn-text') }}
          </span>
          <span class="unverified-users-list-header-desktop__filter-type">
            {{ currentModuleFilter }}
          </span>
        </app-button>
      </template>
    </select-field>
  </div>
</template>

<script lang="ts" setup>
import { SelectField } from '@/fields'
import { Icon, OrderButtons, AppButton } from '@/common'
import { REQUEST_ORDER, UNVERIFIED_USER_SORTING_PARAMS } from '@/enums'

defineProps<{
  currentModuleFilter: string
  moduleNames: string[]
  currentOrder: REQUEST_ORDER
  currentSortingType: UNVERIFIED_USER_SORTING_PARAMS
}>()

const emit = defineEmits<{
  (e: 'update:currentModuleFilter', value: string): void
  (e: 'update:currentOrder', value: REQUEST_ORDER): void
  (e: 'update:currentSortingType', value: UNVERIFIED_USER_SORTING_PARAMS): void
}>()
</script>

<style scoped lang="scss">
.unverified-users-list-header-desktop {
  margin-top: toRem(16);
  padding: toRem(16) toRem(24);
  display: grid;
  align-items: center;
  grid-template-columns: repeat(4, minmax(toRem(50), 4fr)) toRem(190);
}

.unverified-users-list-header-desktop__item {
  display: flex;
  gap: toRem(5);
  height: toRem(19);
}

.unverified-users-list-header-desktop__item-text {
  font-size: toRem(16);
  color: var(--text-primary-light);
}

.unverified-users-list-header-desktop__select-icon {
  color: var(--text-primary-light);
  width: toRem(14);
  height: toRem(14);
  margin-right: toRem(8);
  transition: transform 0.3s ease-in-out;

  &--opened {
    transform: rotate(180deg);
  }
}

.unverified-users-list-header-desktop__select-field {
  &:deep(.select-field__select-dropdown) {
    max-height: 70vh;
  }
}

.unverified-users-list-header-desktop__select-field-text {
  color: var(--text-primary-light);
  font-weight: 400;
  margin-right: toRem(16);
}

.unverified-users-list-header-desktop__filter-type {
  font-weight: 400;
}
</style>
