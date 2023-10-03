<template>
  <div class="unverified-users-list">
    <div class="unverified-users-list__header">
      <unverified-users-list-header
        v-model:current-module-filter="currentModuleFilter"
        v-model:current-order="currentOrder"
        v-model:current-sorting-type="currentSortingType"
        v-model:current-page="currentPage"
        :module-names="moduleNames"
        :page-count="pageCount"
        :total-amount="unverifiedUsersCount"
        :min-page-amount="MIN_PAGE_AMOUNT"
      />
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
import { Loader, ErrorMessage, NoDataMessage, TableNavigation } from '@/common'
import { ErrorHandler } from '@/helpers'
import { UnverifiedModuleUser, UserMeta, UserPermissionInfo } from '@/types'
import { MIN_PAGE_AMOUNT, PAGE_LIMIT } from '@/consts'
import UnverifiedUsersItem from './UnverifiedUsersItem.vue'
import { REQUEST_ORDER, UNVERIFIED_USER_SORTING_PARAMS } from '@/enums'
import { storeToRefs } from 'pinia'
import { usePlatformStore } from '@/store'
import { useContext } from '@/composables'
import UnverifiedUsersListHeader from '@/pages/unverified-users/UnverifiedUsersListHeader.vue'

type ModuleInfo = {
  module: string
  permissions: UserPermissionInfo
}

type PermissionsMap = Record<UnverifiedModuleUser['username'], ModuleInfo[]>

const props = defineProps<{
  searchText: string
}>()

const { $t } = useContext()
const { modules } = storeToRefs(usePlatformStore())
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const unverifiedUsers = ref<UnverifiedModuleUser[]>([])
const unverifiedUsersCount = ref(0)
const currentPage = ref(MIN_PAGE_AMOUNT)
const currentOrder = ref(REQUEST_ORDER.desc)
const currentSortingType = ref(UNVERIFIED_USER_SORTING_PARAMS.createdAt)
const moduleNames = computed(() => [
  $t('unverified-users-list.all-filter'),
  ...modules.value.map(el => el.name),
])
const currentModuleFilter = ref(moduleNames.value[0])
const permissionsMap = ref<PermissionsMap | null>(null)

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
          ...(moduleId.value ? { module: moduleId.value } : {}),
        },
      },
    )
    unverifiedUsersCount.value = meta.total_count
    unverifiedUsers.value = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
}

const getModulePermissions = async (moduleName: string, username: string) => {
  let res = [] as UserPermissionInfo[]
  try {
    const { data } = await api.get<UserPermissionInfo[]>(
      `/integrations/${moduleName}/permissions`,
      { filter: { username } },
    )
    res = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  return res
}

const getPermissionsMap = async (): Promise<void> => {
  try {
    const dataList = await Promise.all(
      unverifiedUsers.value
        .map(user =>
          user.module.map(async module => ({
            username: user.username,
            module,
            permissions: await getModulePermissions(module, user.username),
          })),
        )
        .flat(),
    )

    permissionsMap.value = dataList.reduce(
      (acc, data) => ({
        ...acc,
        [data.username]: [
          ...((acc as PermissionsMap)[data.username] ?? []),
          { module: data.module, permissions: data.permissions },
        ],
      }),
      {},
    )
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
}

const onChange = async () => {
  isLoadFailed.value = false
  isLoaded.value = false
  await getUnverifiedUsersList()
  await getPermissionsMap()
  isLoaded.value = true
}

watch([currentPage, currentSortingType, currentOrder], onChange, {
  immediate: true,
})

watch([() => props.searchText, currentModuleFilter], async () => {
  currentPage.value = 1
  await onChange()
})

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

.unverified-users-list__item {
  display: flex;
  gap: toRem(5);
  height: toRem(19);
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
  color: var(--text-primary-light);
  width: toRem(14);
  height: toRem(14);
  margin-right: toRem(8);
  transition: transform 0.3s ease-in-out;

  &--opened {
    transform: rotate(180deg);
  }
}

.unverified-users-list__select-field {
  &:deep(.select-field__select-dropdown) {
    max-height: 70vh;
  }
}

.unverified-users-list__select-field-text {
  color: var(--text-primary-light);
  font-weight: 400;
  margin-right: toRem(16);
}

.unverified-users-list__select-field-filter-type {
  font-weight: 400;
}

.unverified-users-list__pagination {
  @include respond-to(medium) {
    display: none;
  }
}
</style>
