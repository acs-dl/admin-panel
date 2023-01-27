<template>
  <div class="unverified-users-list">
    <div class="unverified-users-list__header">
      <div class="unverified-users-list__item">
        <span class="unverified-users-list__item-text">
          {{ $t('unverified-users-list.name-text') }}
        </span>
      </div>
      <div class="unverified-users-list__item">
        <span class="unverified-users-list__item-text">
          {{ $t('unverified-users-list.username-text') }}
        </span>
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
      </div>
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
          <template v-if="verifiedUsers.length">
            <unverified-users-item
              v-for="item in verifiedUsers"
              class="unverified-users-list__list-item"
              :key="item.id"
              :user="item"
              @update="getUserList"
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

    <div v-if="isLoaded" class="unverified-users-list__pagination">
      <table-navigation
        v-if="pageCount > MIN_PAGE_AMOUNT"
        v-model:current-page="currentPage"
        class="filters-list-section__navigation"
        :page-count="pageCount"
        :total-amount="usersCount"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { api } from '@/api'
import { Loader, ErrorMessage, NoDataMessage, TableNavigation } from '@/common'
import { ErrorHandler } from '@/helpers'
import { UnverifiedModuleUser } from '@/types'
import { MIN_PAGE_AMOUNT, PAGE_LIMIT } from '@/consts'
import UnverifiedUsersItem from './UnverifiedUsersItem.vue'

const props = defineProps<{
  searchText: string
}>()

const isLoadFailed = ref(false)
const isLoaded = ref(true)
const verifiedUsers = ref<UnverifiedModuleUser[]>([])
const usersCount = ref(0)
const currentPage = ref(MIN_PAGE_AMOUNT)
const pageCount = computed(() => Math.ceil(usersCount.value / PAGE_LIMIT))

const getUserList = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data, meta } = await api.get<UnverifiedModuleUser[]>(
      '/integrations/gitlab/users/unverified',
      {
        page: {
          limit: PAGE_LIMIT,
          number: currentPage.value - 1,
        },
        filter: {
          ...(props.searchText ? { username: props.searchText } : {}),
        },
      },
    )

    usersCount.value = Number(meta?.total_count) ?? 0
    verifiedUsers.value = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

watch(
  () => currentPage.value,
  async () => {
    await getUserList()
  },
  { immediate: true },
)

watch(
  () => props.searchText,
  async () => {
    currentPage.value = 1
    await getUserList()
  },
)

defineExpose({
  getUserList,
})
</script>

<style scoped lang="scss">
.unverified-users-list {
  width: 100%;
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

.unverified-users-list__item-text {
  font-size: toRem(16);
  color: var(--text-primary-light);
}

.unverified-users-list__content {
  margin-bottom: toRem(20);
}

.unverified-users-list__message {
  margin-top: toRem(50);
}
</style>
