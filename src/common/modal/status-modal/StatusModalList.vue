<template>
  <div class="status-modal-list">
    <template v-if="isLoaded">
      <error-message
        v-if="isErrored"
        class="status-modal-list__error-message"
        :message="$t('status-modal-list.error-message')"
      />
      <template v-else>
        <template v-if="requests.length">
          <div class="status-modal-list__header">
            <h5
              v-for="(title, idx) in LIST_TITLES"
              :key="idx"
              class="status-modal-list__header-text"
            >
              {{ title }}
            </h5>
          </div>
          <div class="status-modal-list__list-items-wrapper">
            <status-modal-list-item
              class="status-modal-list__list-item"
              v-for="(request, idx) in requests"
              :key="idx"
              :request="request"
            />
          </div>
          <table-navigation
            v-if="pageCount > MIN_PAGE_AMOUNT"
            v-model:current-page="currentPage"
            class="filters-list-section__navigation"
            :page-count="pageCount"
            :total-amount="userRequestsCount"
          />
        </template>
        <no-data-message
          v-else
          class="status-modal-list__no-data-message"
          :title="$t('status-modal-list.empty-message')"
        />
      </template>
    </template>
    <loader v-else class="status-modal-list__loader" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  StatusModalListItem,
  Loader,
  ErrorMessage,
  NoDataMessage,
  TableNavigation,
} from '@/common'
import { ErrorHandler } from '@/helpers'
import { api } from '@/api'
import { UserRequest, UserMeta } from '@/types'
import { REQUEST_STATUSES } from '@/enums'
import { MIN_COUNT, MIN_PAGE_AMOUNT } from '@/consts'

const PAGE_LIMIT = 5

const props = defineProps<{
  status: REQUEST_STATUSES
}>()

const { t } = useI18n()
const userRequestsCount = ref(MIN_COUNT)
const currentPage = ref(MIN_PAGE_AMOUNT)
const isLoaded = ref(false)
const isErrored = ref(false)
const requests = ref<UserRequest[]>([])

const LIST_TITLES = [
  t('status-modal-list.module-title'),
  t('status-modal-list.user-title'),
  t('status-modal-list.submodule-title'),
  t('status-modal-list.level-title'),
  t('status-modal-list.date-title'),
  t('status-modal-list.status-title'),
]

const pageCount = computed(() =>
  Math.ceil(userRequestsCount.value / PAGE_LIMIT),
)

const loadRequests = async () => {
  isLoaded.value = false
  try {
    const { data, meta } = await api.get<UserRequest[], UserMeta>(
      '/integrations/orchestrator/requests',
      {
        page: {
          limit: PAGE_LIMIT,
          number: currentPage.value - 1,
        },
        filter: {
          ...(props.status === REQUEST_STATUSES.all
            ? {}
            : { status: props.status }),
          action: 'verify_user',
        },
      },
    )

    userRequestsCount.value = meta.total_count
    requests.value = data
  } catch (e) {
    isErrored.value = true
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

watch(
  [currentPage, () => props.status],
  async () => {
    await loadRequests()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.status-modal-list {
  display: flex;
  flex-direction: column;
  min-height: toRem(615);
  min-width: toRem(1000);
  position: relative;
}

.status-modal-list__list-items-wrapper {
  flex: 1;
}

.status-modal-list__list-item {
  margin: toRem(12) 0;
}

.status-modal-list__header {
  display: grid;
  grid-template-columns:
    toRem(80) minmax(toRem(100), 2fr) minmax(toRem(100), 2fr)
    minmax(toRem(130), 1fr) minmax(toRem(100), 1fr) minmax(toRem(110), 1fr);
  gap: toRem(10);
}

.status-modal-list__header-text {
  color: var(--text-primary-light);
  font-size: toRem(16);
  font-weight: 400;
}

.status-modal-list__error-message,
.status-modal-list__loader,
.status-modal-list__no-data-message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
}
</style>
