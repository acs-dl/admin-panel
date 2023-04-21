<template>
  <div class="verified-users">
    <div class="verified-users__title-wrapper">
      <page-title :title="$t('verified-users.main-title')" />
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

    <transition-modal>
      <create-user-modal
        v-if="isShownCreateUserModal"
        @submit="reloadCreateUserModal"
        @cancel="toggleCreateUserModal"
      />
    </transition-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  AppButton,
  CreateUserModal,
  TransitionModal,
  PageTitle,
} from '@/common'
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

  @include respond-to(xsmall) {
    margin-bottom: toRem(12);
  }
}

.verified-users__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;

  @include respond-to(medium) {
    display: block;
  }
}

.verified-users__actions {
  display: flex;
  gap: toRem(23);

  @include respond-to(medium) {
    gap: toRem(12);
    margin-top: toRem(12);
    justify-content: space-between;
  }

  @include respond-to(xsmall) {
    flex-direction: column;
  }
}

.verified-users__search-input {
  max-width: toRem(250);

  @include respond-to(medium) {
    max-width: inherit;
  }
}

.verified-users__add-user-btn {
  @include respond-to(small) {
    font-size: toRem(14);
  }

  @include respond-to(xsmall) {
    width: 100%;
  }
}
</style>
