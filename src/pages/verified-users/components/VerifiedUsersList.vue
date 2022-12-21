<template>
  <div class="verified-users-list">
    <div class="verified-users-list__header">
      <div class="verified-users-list__item">
        <span class="verified-users-list__item-text">
          {{ $t('verified-users-list.name-text') }}
        </span>
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
        <select-field v-model="selectValue" :value-options="POSITIONS">
          <template #head="{ selectField }">
            <app-button color="blue" @click="selectField.toggle()">
              <icon
                class="verified-users-list__select-field-btn-icon"
                :class="{
                  'verified-users-list__select-field-btn-icon--opened':
                    selectField.isOpen,
                }"
                :name="$icons.pyramid"
              />
              <span>{{ $t('verified-users-list.select-field-btn-text') }}</span>
              <span class="verified-users-list__select-field-btn-position">
                {{ selectValue }}
              </span>
            </app-button>
          </template>
        </select-field>
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
        class="filters-list-section__navigation"
        :page-count="pageCount"
        :total-amount="countOfVerifiedUsers"
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
} from '@/common'
import { ErrorHandler } from '@/helpers'
import { VerifiedUser } from '@/types'
import { MIN_PAGE_AMOUNT, PAGE_LIMIT, POSITIONS } from '@/consts'
import VerifiedUsersItem from './VerifiedUsersItem.vue'

const isLoadFailed = ref(false)
const isLoaded = ref(true)
const selectValue = ref(POSITIONS[0])
const verifiedUsers = ref<VerifiedUser[]>([])
const countOfVerifiedUsers = ref(0)
const currentPage = ref(MIN_PAGE_AMOUNT)
const pageCount = computed(() =>
  Math.ceil(countOfVerifiedUsers.value / PAGE_LIMIT),
)

const getUserList = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data } = await api.get<VerifiedUser[]>('/integrations/core/users', {
      filter: {
        position: '',
      },
      page: {
        limit: PAGE_LIMIT,
        number: currentPage.value - 1,
      },
    })
    countOfVerifiedUsers.value = data.length
    verifiedUsers.value = data
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const deleteUser = async (id: string) => {
  try {
    await api.delete(`/integrations/core/users/${id}`)
    await getUserList()
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

watch(
  () => currentPage.value,
  async () => {
    await getUserList()
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.verified-users-list {
  width: 100%;
  background: var(--app-bg-tertiary);
  border-radius: toRem(15);
  color: var(--text-secondary-main);
}

.verified-users-list__header {
  padding: toRem(20) toRem(24);
  display: grid;
  align-items: center;
  grid-template-columns: repeat(3, minmax(toRem(100), 1fr)) toRem(250);
}

.verified-users-list__item-text {
  font-size: toRem(16);
  color: var(--text-primary-light);
}

.verified-users-list__footer {
  display: flex;
  justify-content: center;
  margin: toRem(16) 0;
}

.verified-users-list__content {
  min-height: toRem(540);
}

.verified-users-list__message {
  margin-top: toRem(50);
}

.verified-users-list__select-field-btn-icon {
  width: toRem(14);
  height: toRem(14);
  margin-right: toRem(8);
  transition: transform 0.3s ease-in-out;

  &--opened {
    transform: rotate(180deg);
  }
}

.verified-users-list__select-field-btn-position {
  font-weight: 400;
  margin-left: toRem(8);
  color: var(--text-primary-light);
}
</style>
