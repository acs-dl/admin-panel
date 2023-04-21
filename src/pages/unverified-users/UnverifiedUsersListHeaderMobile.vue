<template>
  <div class="unverified-users-list-header-mobile">
    <!--TODO: EDIT SELECT LOGIC-->
    <select-field
      class="unverified-users-list-header-mobile__select-field"
      :model-value="currentModuleFilter"
      :value-options="moduleNames"
      @update:model-value="emit('update:currentModuleFilter', $event)"
    >
      <template #head="{ selectField }">
        <app-button color="blue" @click="selectField.toggle">
          <icon
            class="unverified-users-list-header-mobile__select-icon"
            :class="{
              'unverified-users-list-header-mobile__select-icon--opened':
                selectField.isOpen,
            }"
            :name="$icons.pyramid"
          />
          <span class="unverified-users-list-header-mobile__select-field-text">
            {{ $t('unverified-users-list.select-field-btn-text') }}
          </span>
          <span class="unverified-users-list-header-mobile__filter-type">
            {{ currentModuleFilter }}
          </span>
        </app-button>
      </template>
    </select-field>
    <div class="unverified-users-list-header-mobile__actions">
      <!--TODO: EDIT SELECT LOGIC-->
      <select-field
        class="unverified-users-list-header-mobile__select-field"
        v-model="sortingType"
        :value-options="sortingOptions"
        @update-id="updateSortingParams($event)"
      >
        <template #head="{ selectField }">
          <app-button
            class="unverified-users-list-header-mobile__select-sorting-button"
            color="blue"
            @click="selectField.toggle"
          >
            <span
              class="unverified-users-list-header-mobile__select-field-text"
            >
              {{ $t('unverified-users-list-header-mobile.sorting-by') }}
            </span>
            <span class="unverified-users-list-header-mobile__filter-type">
              {{ localizedSortingOption }}
            </span>
          </app-button>
        </template>
      </select-field>
      <div class="unverified-users-list__pagination">
        <table-navigation
          class="filters-list-section__navigation"
          v-if="pageCount > minPageAmount"
          :current-page="currentPage"
          :page-count="pageCount"
          :total-amount="totalAmount"
          @update:current-page="emit('update:currentPage', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SelectField } from '@/fields'
import { AppButton, TableNavigation, Icon } from '@/common'
import { computed, ref } from 'vue'
import { REQUEST_ORDER, UNVERIFIED_USER_SORTING_PARAMS } from '@/enums'
import { useContext } from '@/composables'

enum SORTING_ID {
  all,
  dateAsc,
  dateDesc,
  nameAsc,
  nameDesc,
  usernameAcs,
  usernameDesc,
}

defineProps<{
  currentModuleFilter: string
  moduleNames: string[]
  currentOrder: REQUEST_ORDER
  currentSortingType: UNVERIFIED_USER_SORTING_PARAMS
  pageCount: number
  totalAmount: number
  currentPage: number
  minPageAmount: number
}>()

const emit = defineEmits<{
  (e: 'update:currentModuleFilter', value: string): void
  (e: 'update:currentOrder', value: REQUEST_ORDER): void
  (e: 'update:currentSortingType', value: UNVERIFIED_USER_SORTING_PARAMS): void
  (e: 'update:currentPage', value: number): void
}>()

const { $t } = useContext()

const sortingOptions = computed(() => [
  {
    id: SORTING_ID.all,
    text: $t('unverified-users-list-header-mobile.sorting-all'),
  },
  {
    id: SORTING_ID.dateAsc,
    text: $t('unverified-users-list-header-mobile.sorting-date-asc'),
  },
  {
    id: SORTING_ID.dateDesc,
    text: $t('unverified-users-list-header-mobile.sorting-date-desc'),
  },
  {
    id: SORTING_ID.nameAsc,
    text: $t('unverified-users-list-header-mobile.sorting-name-asc'),
  },
  {
    id: SORTING_ID.nameDesc,
    text: $t('unverified-users-list-header-mobile.sorting-name-desc'),
  },
  {
    id: SORTING_ID.usernameDesc,
    text: $t('unverified-users-list-header-mobile.sorting-username-desc'),
  },
  {
    id: SORTING_ID.usernameAcs,
    text: $t('unverified-users-list-header-mobile.sorting-username-asc'),
  },
])

const sortingId = ref(SORTING_ID.all)
const localizedSortingOption = computed(
  () =>
    sortingOptions.value.find(item => item.id === sortingId.value)?.text ??
    sortingOptions.value[0].text,
)
const sortingType = ref(localizedSortingOption.value)

const updateSortingParams = (id: number) => {
  sortingId.value = id
  let orderToSet
  let sortingTypeToSet
  switch (id) {
    case SORTING_ID.dateAsc:
      orderToSet = REQUEST_ORDER.asc
      sortingTypeToSet = UNVERIFIED_USER_SORTING_PARAMS.createdAt
      break
    case SORTING_ID.dateDesc:
      orderToSet = REQUEST_ORDER.desc
      sortingTypeToSet = UNVERIFIED_USER_SORTING_PARAMS.createdAt
      break
    case SORTING_ID.nameAsc:
      orderToSet = REQUEST_ORDER.asc
      sortingTypeToSet = UNVERIFIED_USER_SORTING_PARAMS.name
      break
    case SORTING_ID.nameDesc:
      orderToSet = REQUEST_ORDER.desc
      sortingTypeToSet = UNVERIFIED_USER_SORTING_PARAMS.name
      break
    case SORTING_ID.usernameAcs:
      orderToSet = REQUEST_ORDER.asc
      sortingTypeToSet = UNVERIFIED_USER_SORTING_PARAMS.username
      break
    case SORTING_ID.usernameDesc:
      orderToSet = REQUEST_ORDER.desc
      sortingTypeToSet = UNVERIFIED_USER_SORTING_PARAMS.username
      break
    default:
      orderToSet = REQUEST_ORDER.empty
      sortingTypeToSet = UNVERIFIED_USER_SORTING_PARAMS.empty
      break
  }
  emit('update:currentSortingType', sortingTypeToSet)
  emit('update:currentOrder', orderToSet)
}
</script>

<style scoped lang="scss">
.unverified-users-list-header-mobile {
  margin: toRem(24) 0 toRem(16);
}

.unverified-users-list-header-mobile__select-icon {
  color: var(--text-primary-light);
  width: toRem(14);
  height: toRem(14);
  margin-right: toRem(8);
  transition: transform 0.3s ease-in-out;

  &--opened {
    transform: rotate(180deg);
  }
}

.unverified-users-list-header-mobile__select-field {
  width: fit-content;
  margin: 0 auto;

  &:deep(.select-field__select-dropdown) {
    max-height: 70vh;
    min-width: toRem(230);
  }
}

.unverified-users-list-header-mobile__select-field-text {
  color: var(--text-primary-light);
  font-weight: 400;
  margin-right: toRem(16);

  @include respond-to(xsmall) {
    font-size: toRem(14);
    margin-right: toRem(8);
  }
}

.unverified-users-list-header-mobile__filter-type {
  font-weight: 400;

  @include respond-to(xsmall) {
    font-size: toRem(14);
  }
}

.unverified-users-list-header-mobile__actions {
  display: flex;
  align-items: center;
  margin-top: toRem(24);

  @include respond-to(small) {
    flex-direction: column;
    gap: toRem(12);
  }
}

.unverified-users-list-header-mobile__select-sorting-button {
  @include respond-to(xsmall) {
    flex-direction: column;
  }
}
</style>
