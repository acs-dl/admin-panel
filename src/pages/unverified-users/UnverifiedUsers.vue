<template>
  <div class="unverified-users">
    <div class="unverified-users__title-wrapper">
      <h2 class="unverified-users__title">
        {{ $t('unverified-users.main-title') }}
      </h2>
      <app-button
        class="unverified-users__add-user-btn"
        size="medium"
        modification="border-rounded"
        scheme="filled"
        :text="$t('unverified-users.add-user-btn')"
        @click="toggleCreateNewMemberModal"
      />
    </div>

    <unverified-users-list />

    <create-user-modal
      v-if="isShowCreateUserModal"
      @sumbit="reloadCreateNewMemberModal"
      @cancel="toggleCreateNewMemberModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppButton, CreateUserModal } from '@/common'
import UnverifiedUsersList from './components/UnverifiedUsersList.vue'

const isShowCreateUserModal = ref(false)

const toggleCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = !isShowCreateUserModal.value
}

const reloadCreateNewMemberModal = async () => {
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
</style>
