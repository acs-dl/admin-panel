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
        <select-field
          v-model="selectValue"
          :placeholder="'laceholder'"
          :value-options="['1', '2', '3', '4', '5', '6', '7']"
          :error-message="selectValue === '7' ? 'error for number 7' : ''"
        />
      </div>
    </div>
    <hr class="verified-users-list__line" />
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
    <hr class="verified-users-list__line" />
    <div class="verified-users-list__footer">
      <template v-if="isLoaded">
        <!-- <table-navigation
          v-if="countOfApys && pageCount > MIN_PAGE_AMOUNT"
          class="verified-users-list__navigation"
          :page-limit="PAGE_LIMIT"
          :current-page="currentPage"
          :page-count="pageCount"
          :total-amount="countOfApys"
          @decrease-page-count="decreasePageCount"
          @increase-page-count="increasePageCount"
        /> -->
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { api } from '@/api'
import { SelectField } from '@/fields'
import { Loader, ErrorMessage, NoDataMessage } from '@/common'
import { ErrorHandler } from '@/helpers'
import { VerifiedUser } from '@/types'
import VerifiedUsersItem from './VerifiedUsersItem.vue'

const isLoadFailed = ref(false)
const isLoaded = ref(true)
const selectValue = ref('')
const verifiedUsers = ref<VerifiedUser[]>([])

const getUserList = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data } = await api.get<VerifiedUser[]>('/integrations/core/users')
    // const { data } = await api.post('/integrations/core/users', {
    //   data: {
    //     type: 'users',
    //     id: '2',
    //     attributes: {
    //       name: 'Valeriia',
    //       surname: 'Dubina',
    //       position: 'project-manager',
    //     },
    //   },
    // })
    // console.log(data)
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

getUserList()
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
  grid-template-columns: repeat(3, minmax(toRem(100), 4fr)) toRem(150);
}

.verified-users-list__line {
  margin: 0;
  border: toRem(0.5) solid var(--text-quaternary-main);
}

.verified-users-list__item-text {
  font-size: toRem(14);
  font-weight: 500;
}

.verified-users-list__footer {
  display: flex;
  justify-content: space-between;
}

.verified-users-list__content {
  min-height: toRem(540);
}

.verified-users-list__message {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
}
</style>
