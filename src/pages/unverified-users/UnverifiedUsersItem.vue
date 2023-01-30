<template>
  <div class="unverified-users-item">
    <span class="unverified-users-item__text">
      {{ $t('unverified-users-item.unverified-name') }}
    </span>
    <span class="unverified-users-item__text">
      {{ user.username }}
    </span>
    <span class="unverified-users-item__text">
      {{ user.module || $t('unverified-users-item.telegram') }}
    </span>
    <span
      class="unverified-users-item__text"
      :title="formatDMYHM(user.created_at)"
    >
      {{ formatDMYHM(user.created_at) }}
    </span>

    <div class="unverified-users-item__buttons">
      <app-button
        class="unverified-users-item__btn"
        color="blue"
        :text="$t('unverified-users-item.verify-btn')"
        @click="toggleCreateNewMemberModal"
      />
      <app-button
        class="unverified-users-item__btn"
        color="error"
        :icon-left="$icons.trash"
        @click="toggleRemoveModal"
      />
    </div>

    <verify-user-modal
      v-if="isShowCreateUserModal"
      :user="user"
      @cancel="toggleCreateNewMemberModal"
      @submit="updateList"
    />

    <delete-modal
      v-if="isOpenRemoveModal"
      :icon="$icons.trash"
      @cancel="toggleRemoveModal"
      @delete="removeUser"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { api } from '@/api'
import { AppButton, VerifyUserModal, DeleteModal } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { ErrorHandler, formatDMYHM } from '@/helpers'

const props = defineProps<{
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'update'): void
  (e: 'cancel'): void
}>()

const isOpenRemoveModal = ref(false)
const isShowCreateUserModal = ref(false)

const toggleCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = !isShowCreateUserModal.value
}

const toggleRemoveModal = () => {
  isOpenRemoveModal.value = !isOpenRemoveModal.value
}

const updateList = async () => {
  emit('update')
}

const removeUser = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: props.user.module,
          payload: {
            action: 'delete_user',
            username: props.user.username,
          },
        },
        relationships: {
          user: {
            data: {
              id: '1',
            },
          },
        },
      },
    })
    updateList()
    isOpenRemoveModal.value = false
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>

<style lang="scss" scoped>
.unverified-users-item {
  display: grid;
  grid-column-gap: toRem(10);
  grid-template-columns: repeat(4, minmax(toRem(50), 1fr)) toRem(155);
  padding: toRem(24);
  align-items: center;
  max-height: toRem(72);
  height: 100%;
  background: var(--background-primary-light);
  margin-bottom: toRem(8);
}

.unverified-users-item__text {
  font-weight: 400;
  font-size: toRem(16);
  line-height: 1.2;
  color: var(--text-secondary-light);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.unverified-users-item__buttons {
  display: flex;
  gap: toRem(25);
  justify-content: space-between;
}

.unverified-users-item__btn {
  font-size: toRem(16);
  font-weight: 400;
}
</style>
