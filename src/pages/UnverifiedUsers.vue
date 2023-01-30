<template>
  <div class="unverified-users">
    <div class="unverified-users__title-wrapper">
      <h2 class="unverified-users__title">
        {{ $t('unverified-users.main-title') }}
      </h2>
      <div class="unverified-users__actions">
        <input-field
          v-model="searchValue"
          class="unverified-users__search-input"
          scheme="primary-gray"
          :placeholder="$t('unverified-users.search-placeholder')"
          :icon-left="$icons.search"
        />
        <app-button
          class="unverified-users__add-user-btn"
          size="medium"
          modification="border-rounded"
          scheme="filled"
          :text="$t('unverified-users.add-user-btn')"
          @click="toggleCreateNewMemberModal"
        />
      </div>
    </div>

    <unverified-users-list :search-text="searchValue" ref="usersList" />

    <create-user-modal
      v-if="isShowCreateUserModal"
      @submit="reloadCreateNewMemberModal"
      @cancel="toggleCreateNewMemberModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppButton, CreateUserModal } from '@/common'
import { InputField } from '@/fields'
import UnverifiedUsersList from '@/pages/unverified-users//UnverifiedUsersList.vue'

const usersList = ref<InstanceType<typeof UnverifiedUsersList> | null>(null)
const isShowCreateUserModal = ref(false)
const searchValue = ref('')
const toggleCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = !isShowCreateUserModal.value
}

const reloadCreateNewMemberModal = async () => {
  if (usersList.value) {
    await usersList.value.getUserList()
  }
  isShowCreateUserModal.value = false
}
</script>

<style scoped lang="scss">
.unverified-users__title {
  font-size: toRem(24);
  font-weight: 700;
}

.unverified-users__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unverified-users__actions {
  display: flex;
  gap: toRem(10);
}

.unverified-users__search-input {
  width: toRem(220);
}
</style>
