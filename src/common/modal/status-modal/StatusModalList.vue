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
import { useWindowSize } from '@vueuse/core'

const LARGE_HEIGHT_PAGE_LIMIT = 5
const NORMAL_HEIGHT_PAGE_LIMIT = 4

const MEDIUM_HEIGHT = 850 //px

const props = defineProps<{
  status: REQUEST_STATUSES
}>()

const { height } = useWindowSize()
const { t } = useI18n()
const userRequestsCount = ref(MIN_COUNT)
const currentPage = ref(MIN_PAGE_AMOUNT)
const isLoaded = ref(false)
const isErrored = ref(false)
const requests = ref<UserRequest[]>([])

const pageLimit = computed(() =>
  height.value > MEDIUM_HEIGHT
    ? LARGE_HEIGHT_PAGE_LIMIT
    : NORMAL_HEIGHT_PAGE_LIMIT,
)

const LIST_TITLES = [
  t('status-modal-list.module-title'),
  t('status-modal-list.user-title'),
  t('status-modal-list.request-title'),
  t('status-modal-list.date-title'),
  t('status-modal-list.status-title'),
]

const pageCount = computed(() =>
  Math.ceil(userRequestsCount.value / pageLimit.value),
)

const loadRequests = async () => {
  isLoaded.value = false
  isErrored.value = false
  try {
    const { data, meta } = await api.get<UserRequest[], UserMeta>(
      '/integrations/orchestrator/requests',
      {
        page: {
          limit: pageLimit.value,
          number: currentPage.value - 1,
        },
        filter: {
          ...(props.status === REQUEST_STATUSES.all
            ? {}
            : { status: props.status }),
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
  () => props.status,
  async () => {
    currentPage.value = MIN_PAGE_AMOUNT
    await loadRequests()
  },
)

watch(
  [currentPage, pageLimit],
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
  flex-grow: 1;
  min-width: toRem(1000);
  position: relative;
  min-height: toRem(300);

  @include respond-to(large) {
    min-width: toRem(900);
  }

  @include respond-to(medium) {
    min-width: auto;
    flex-grow: initial;
  }
}

.status-modal-list__list-items-wrapper {
  flex: 1;

  @include respond-to(medium) {
    max-height: toRem(350);
    overflow-y: scroll;
  }
}

.status-modal-list__list-item {
  margin: toRem(12) 0;
}

.status-modal-list__header {
  display: grid;
  grid-template-columns:
    toRem(80) minmax(toRem(100), toRem(200)) minmax(toRem(100), 3fr)
    minmax(toRem(100), 1fr) minmax(toRem(145), 1fr);
  gap: toRem(10);

  @include respond-to(medium) {
    display: none;
  }
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
