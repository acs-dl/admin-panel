<template>
  <div class="verified-users-list">
    <div class="verified-users-list__header">
      <div class="verified-users-list__item">
        <span class="verified-users-list__item-text">
          {{ $t('verified-users-list.name-text') }}
        </span>
        <order-buttons v-model:order="currentOrder" />
      </div>
      <div class="verified-users-list__item">
        <span class="verified-users-list__item-text">
          {{ $t('verified-users-list.position-text') }}
        </span>
      </div>
      <div class="verified-users-list__item">
        <span class="verified-users-list__item-text">
          {{ $t('verified-users-list.telegram-text') }}
        </span>
      </div>
      <div class="verified-users-list__item">
        <select-field
          v-if="positions.length"
          v-model="selectedPosition"
          class="verified-users-list__item-select"
          :value-options="positionsList"
        >
          <template #head="{ selectField }">
            <app-button color="blue" @click="selectField.toggle">
              <icon
                class="verified-users-list__select-field-btn-icon"
                :class="{
                  'verified-users-list__select-field-btn-icon--opened':
                    selectField.isOpen,
                }"
                :name="$icons.pyramid"
              />
              <span class="verified-users-list__select-field-text">
                {{ $t('verified-users-list.select-field-btn-text') }}
              </span>
              <span class="verified-users-list__select-field-btn-position">
                {{ selectField.chosenLabel }}
              </span>
            </app-button>
          </template>
        </select-field>
      </div>
    </div>

    <div class="verified-users-list__header-mobile">
      <div class="verified-users-list__item verified-users-list__header-select">
        <select-field
          v-if="positions.length"
          v-model="selectedPosition"
          :value-options="positionsList"
        >
          <template #head="{ selectField }">
            <app-button color="blue" @click="selectField.toggle">
              <icon
                class="verified-users-list__select-field-btn-icon"
                :class="{
                  'verified-users-list__select-field-btn-icon--opened':
                    selectField.isOpen,
                }"
                :name="$icons.pyramid"
              />
              <span class="verified-users-list__select-field-text">
                {{ $t('verified-users-list.select-field-btn-text') }}
              </span>
              <span class="verified-users-list__select-field-btn-position">
                {{ selectField.chosenLabel }}
              </span>
            </app-button>
          </template>
        </select-field>
      </div>
      <div class="verified-users-list__navigation-mobile">
        <div v-if="verifiedUsers.length" class="verified-users-list__item">
          <span class="verified-users-list__item-text">
            {{ $t('verified-users-list.name-text') }}
          </span>
        </div>
        <table-navigation
          v-if="pageCount > MIN_PAGE_AMOUNT && isLoaded"
          v-model:current-page="currentPage"
          :page-count="pageCount"
          :total-amount="verifiedUsersCount"
        />
      </div>
    </div>

    <div class="verified-users-list__content">
      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message
            class="verified-users-list__message"
            :message="$t('verified-users-list.error-message')"
          />
        </template>
        <template v-else>
          <template v-if="verifiedUsers.length">
            <verified-users-item
              v-for="item in verifiedUsers"
              class="verified-users-list__list-item"
              :key="item.id"
              :user="item"
              @delete="deleteUser"
            />
          </template>
          <template v-else>
            <no-data-message
              class="verified-users-list__message"
              :title="$t('verified-users-list.no-data-title')"
              :message="$t('verified-users-list.no-data-message')"
            />
          </template>
        </template>
      </template>
      <template v-else>
        <loader class="verified-users-list__message" />
      </template>
    </div>

    <div v-if="isLoaded" class="verified-users-list__footer">
      <table-navigation
        v-if="pageCount > MIN_PAGE_AMOUNT"
        v-model:current-page="currentPage"
        :page-count="pageCount"
        :total-amount="verifiedUsersCount"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { api } from '@/api'
import { SelectField } from '@/fields'
import {
  Loader,
  ErrorMessage,
  NoDataMessage,
  TableNavigation,
  AppButton,
  Icon,
  OrderButtons,
} from '@/common'
import { ErrorHandler, Bus } from '@/helpers'
import { VerifiedUser, UserMeta } from '@/types'
import { MIN_PAGE_AMOUNT, PAGE_LIMIT } from '@/consts'
import { useAuthStore, usePlatformStore } from '@/store'
import { storeToRefs } from 'pinia'
import VerifiedUsersItem from './VerifiedUsersItem.vue'
import { useContext } from '@/composables'

const ALL_SORTING_ID = 0

const props = defineProps<{
  searchText: string
}>()

const { $t } = useContext()
const { currentUserId } = useAuthStore()
const { positions } = storeToRefs(usePlatformStore())
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const verifiedUsers = ref<VerifiedUser[]>([])
const verifiedUsersCount = ref(0)
const currentPage = ref(MIN_PAGE_AMOUNT)
const currentOrder = ref('')
const selectedPosition = ref<string | number>(ALL_SORTING_ID)

const positionsList = computed(() => [
  {
    label: $t('verified-users-list.all-filter'),
    value: ALL_SORTING_ID,
  },
  ...positions.value.map(position => ({
    label: position,
    value: position,
  })),
])

const pageCount = computed(() =>
  Math.ceil(verifiedUsersCount.value / PAGE_LIMIT),
)

const getUserList = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data, meta } = await api.get<VerifiedUser[], UserMeta>(
      '/integrations/identity-svc/users',
      {
        filter: {
          ...(selectedPosition.value === ALL_SORTING_ID
            ? {}
            : { position: selectedPosition.value }),
          ...(props.searchText ? { search: props.searchText } : {}),
        },
        page: {
          limit: PAGE_LIMIT,
          number: currentPage.value - 1,
          ...(currentOrder.value ? { order: currentOrder.value } : {}),
        },
      },
    )
    verifiedUsersCount.value = meta.total_count
    verifiedUsers.value = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const deleteUser = async (id: string) => {
  try {
    await api.delete(`/integrations/identity-svc/users/${id}`, {
      data: {
        attributes: {
          from_user: String(currentUserId),
          to_user: id,
        },
      },
    })
    await getUserList()
    Bus.success($t('verified-users-list.success-deleting'))
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

watch(
  [currentPage, currentOrder],
  async () => {
    await getUserList()
  },
  { immediate: true },
)

watch([() => props.searchText, selectedPosition], async () => {
  currentPage.value = 1
  await getUserList()
})

defineExpose({
  getUserList,
})
</script>

<style scoped lang="scss">
.verified-users-list {
  width: 100%;
  background: var(--app-bg-tertiary);
  border-radius: toRem(15);
  color: var(--text-secondary-main);
}

.verified-users-list__header {
  margin-top: toRem(16);
  padding: toRem(16) toRem(24);
  display: grid;
  align-items: center;
  grid-template-columns: repeat(3, minmax(toRem(100), 1fr)) toRem(250);

  @include respond-to(medium) {
    display: none;
  }
}

.verified-users-list__item {
  display: flex;
  gap: toRem(5);
  height: toRem(19);
}

.verified-users-list__item-text {
  font-size: toRem(16);
  color: var(--text-primary-light);
}

.verified-users-list__footer {
  display: flex;
  justify-content: center;
  margin: toRem(16) 0;

  @include respond-to(medium) {
    display: none;
  }
}

.verified-users-list__content {
  margin-bottom: toRem(20);
}

.verified-users-list__message {
  margin-top: toRem(50);
}

.verified-users-list__select-field-btn-icon {
  color: var(--text-primary-light);
  width: toRem(14);
  height: toRem(14);
  margin-right: toRem(8);
  transition: transform 0.3s ease-in-out;

  &--opened {
    transform: rotate(180deg);
  }
}

.verified-users-list__select-field-text {
  color: var(--text-primary-light);
  font-weight: 400;
}

.verified-users-list__select-field-btn-position {
  font-weight: 400;
  margin-left: toRem(16);
  color: var(--primary-main);
}

.verified-users-list__header-mobile {
  display: none;

  @include respond-to(medium) {
    display: block;
    margin-bottom: toRem(15);
    padding: 0 toRem(12);
  }
}

.verified-users-list__header-select {
  @include respond-to(medium) {
    width: fit-content;
    margin: toRem(24) auto;
  }
}

.verified-users-list__navigation-mobile {
  @include respond-to(medium) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: toRem(24);
  }
}

.verified-users-list__list-item {
  @include respond-to(medium) {
    max-width: 100%;
  }
}

.verified-users-list__item-select {
  &:deep(.select-field__select-dropdown) {
    max-height: toRem(200);
  }
}
</style>
