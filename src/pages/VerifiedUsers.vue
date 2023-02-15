<template>
  <div class="verified-users">
    <div class="verified-users__title-wrapper">
      <h2 class="verified-users__title">
        {{ $t('verified-users.main-title') }}
      </h2>
      <div class="verified-users__actions">
        <input-field
          v-model="searchValue"
          class="verified-users__search-input"
          icon-button
          scheme="primary-gray"
          :placeholder="$t('verified-users.search-placeholder')"
          :icon-left="$icons.search"
          :icon-right="iconRight"
          @right-icon-click="clearInput"
        />
        <app-button
          class="verified-users__add-user-btn"
          size="medium"
          modification="border-rounded"
          scheme="filled"
          :text="$t('verified-users.add-user-btn')"
          @click="toggleCreateUserModal"
        />
      </div>
    </div>
    <verified-users-list :search-text="searchValue" ref="usersList" />

    <create-user-modal
      :is-shown="isShownCreateUserModal"
      @submit="reloadCreateUserModal"
      @cancel="toggleCreateUserModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { AppButton, CreateUserModal } from '@/common'
import { InputField } from '@/fields'
import VerifiedUsersList from '@/pages/verified-users/VerifiedUsersList.vue'
import { ICON_NAMES } from '@/enums'

const usersList = ref<InstanceType<typeof VerifiedUsersList> | null>(null)
const isShownCreateUserModal = ref(false)

const searchValue = ref('')

const iconRight = computed(() => (searchValue.value ? ICON_NAMES.x : undefined))

const clearInput = () => {
  searchValue.value = ''
}

const toggleCreateUserModal = async () => {
  isShownCreateUserModal.value = !isShownCreateUserModal.value
}

const reloadCreateUserModal = async () => {
  if (usersList.value) {
    await usersList.value.getUserList()
  }
  isShownCreateUserModal.value = false
}
</script>

<style scoped lang="scss">
.verified-users__title {
  font-size: toRem(24);
  font-weight: 700;
}

.verified-users__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.verified-users__actions {
  display: flex;
  gap: toRem(10);
}

.verified-users__search-input {
  width: toRem(250);
}
</style>
