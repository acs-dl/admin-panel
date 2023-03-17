<template>
  <div class="unverified-users-list">
    <div class="unverified-users-list__header">
      <div class="unverified-users-list__item">
        <span class="unverified-users-list__item-text">
          {{ $t('unverified-users-list.name-text') }}
        </span>
        <order-buttons
          class="unverified-users-list__order-buttons"
          v-model:order="currentOrder"
          v-model:current-sorting-type="currentSortingType"
          :sorting-type-for-pick="UNVERIFIED_USER_SORTING_PARAMS.name"
        />
      </div>
      <div class="unverified-users-list__item">
        <span class="unverified-users-list__item-text">
          {{ $t('unverified-users-list.username-text') }}
        </span>
        <order-buttons
          class="unverified-users-list__order-buttons"
          v-model:order="currentOrder"
          v-model:current-sorting-type="currentSortingType"
          :sorting-type-for-pick="UNVERIFIED_USER_SORTING_PARAMS.username"
        />
      </div>
      <div class="unverified-users-list__item">
        <span class="unverified-users-list__item-text">
          {{ $t('unverified-users-list.modules-text') }}
        </span>
      </div>
      <div class="unverified-users-list__item">
        <span class="unverified-users-list__item-text">
          {{ $t('unverified-users-list.date-text') }}
        </span>
        <order-buttons
          class="unverified-users-list__order-buttons"
          v-model:order="currentOrder"
          v-model:current-sorting-type="currentSortingType"
          :sorting-type-for-pick="UNVERIFIED_USER_SORTING_PARAMS.createdAt"
        />
      </div>
      <select-field v-model="currentModuleFilter" :value-options="moduleNames">
        <template #head="{ selectField }">
          <app-button color="blue" @click="selectField.toggle()">
            <icon
              class="unverified-users-list__select-field-btn-icon"
              :class="{
                'unverified-users-list__select-field-btn-icon--opened':
                  selectField.isOpen,
              }"
              :name="$icons.pyramid"
            />
            <span>
              {{
                $t('unverified-users-list.select-field-btn-text', {
                  filter: currentModuleFilter,
                })
              }}
            </span>
          </app-button>
        </template>
      </select-field>
    </div>
    <div class="unverified-users-list__content">
      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message
            class="unverified-users-list__message"
            :message="$t('unverified-users-list.error-message')"
          />
        </template>
        <template v-else>
          <template v-if="unverifiedUsers.length">
            <unverified-users-item
              v-for="item in unverifiedUsers"
              class="unverified-users-list__list-item"
              :key="item.id"
              :user="item"
              @update="getUnverifiedUsersList"
            />
          </template>
          <template v-else>
            <no-data-message
              class="unverified-users-list__message"
              :title="$t('unverified-users-list.no-data-title')"
              :message="$t('unverified-users-list.no-data-message')"
            />
          </template>
        </template>
      </template>
      <template v-else>
        <loader class="unverified-users-list__message" />
      </template>
    </div>

    <template v-if="isPaginationShown">
      <div class="unverified-users-list__pagination">
        <table-navigation
          v-if="pageCount > MIN_PAGE_AMOUNT"
          v-model:current-page="currentPage"
          class="filters-list-section__navigation"
          :page-count="pageCount"
          :total-amount="unverifiedUsersCount"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { api } from '@/api'
import {
  Loader,
  ErrorMessage,
  NoDataMessage,
  TableNavigation,
  OrderButtons,
  Icon,
  AppButton,
} from '@/common'
import { SelectField } from '@/fields'
import { ErrorHandler } from '@/helpers'
import { UnverifiedModuleUser, UserMeta } from '@/types'
import { ALL_FILTER, MIN_PAGE_AMOUNT, PAGE_LIMIT } from '@/consts'
import UnverifiedUsersItem from './UnverifiedUsersItem.vue'
import { REQUEST_ORDER, UNVERIFIED_USER_SORTING_PARAMS } from '@/enums'
import { storeToRefs } from 'pinia'
import { usePlatformStore } from '@/store'

const props = defineProps<{
  searchText: string
}>()

const { modules } = storeToRefs(usePlatformStore())
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const unverifiedUsers = ref<UnverifiedModuleUser[]>([])
const unverifiedUsersCount = ref(0)
const currentPage = ref(MIN_PAGE_AMOUNT)
const currentOrder = ref(REQUEST_ORDER.asc)
const currentSortingType = ref(UNVERIFIED_USER_SORTING_PARAMS.name)
const currentModuleFilter = ref(ALL_FILTER)

const moduleNames = computed(() =>
  [ALL_FILTER].concat(modules.value.map(el => el.name)),
)

const moduleId = computed(
  () => modules.value.find(el => el.name === currentModuleFilter.value)?.id,
)

const pageCount = computed(() =>
  Math.ceil(unverifiedUsersCount.value / PAGE_LIMIT),
)
const isPaginationShown = computed(
  () => isLoaded.value && unverifiedUsers.value.length && !isLoadFailed.value,
)

const getUnverifiedUsersList = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data, meta } = await api.get<UnverifiedModuleUser[], UserMeta>(
      '/integrations/unverified-svc/users',
      {
        page: {
          limit: PAGE_LIMIT,
          number: currentPage.value - 1,
          ...(currentSortingType.value
            ? { sort: currentSortingType.value }
            : {}),
          ...(currentOrder.value ? { order: currentOrder.value } : {}),
        },
        filter: {
          ...(props.searchText ? { search: props.searchText } : {}),
          ...(moduleId.value === ALL_FILTER ? {} : { module: moduleId.value }),
        },
      },
    )
    unverifiedUsersCount.value = meta.total_count
    unverifiedUsers.value = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

watch(
  [currentPage, currentSortingType, currentOrder, currentModuleFilter],
  async () => {
    await getUnverifiedUsersList()
  },
  { immediate: true },
)

watch(
  () => props.searchText,
  async () => {
    currentPage.value = 1
    await getUnverifiedUsersList()
  },
)

defineExpose({
  getUnverifiedUsersList,
})
</script>

<style scoped lang="scss">
.unverified-users-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--app-bg-tertiary);
  border-radius: toRem(15);
  color: var(--text-secondary-main);
}

.unverified-users-list__header {
  padding: toRem(20) toRem(24);
  display: grid;
  align-items: center;
  grid-template-columns: repeat(4, minmax(toRem(50), 4fr)) toRem(155);
}

.unverified-users-list__item {
  display: flex;
  gap: toRem(5);
}

.unverified-users-list__item-text {
  font-size: toRem(16);
  color: var(--text-primary-light);
}

.unverified-users-list__content {
  margin-bottom: toRem(20);
  flex: 1;
}

.unverified-users-list__message {
  margin-top: toRem(50);
}

.unverified-users-list__select-field-btn-icon {
  width: toRem(14);
  height: toRem(14);
  margin-right: toRem(8);
  transition: transform 0.3s ease-in-out;

  &--opened {
    transform: rotate(180deg);
  }
}
</style>
