<template>
  <div class="unverified-users-item">
    <span class="unverified-users-item__text">
      {{ userName }}
    </span>
    <span class="unverified-users-item__text">
      {{ user.username }}
    </span>
    <span class="unverified-users-item__text">
      <img
        v-for="(module, idx) in user.module"
        :key="idx"
        class="unverified-users-item__img"
        :src="getModuleImage(module)"
        :alt="user.module[idx]"
      />
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
        color="gray"
        :icon-left="$icons.trash"
        @click="toggleDeleteModal"
      />
    </div>

    <transition-modal>
      <verify-user-modal
        v-if="isShownVerifyUserModal"
        :user="user"
        :is-multiple-modules="user.module.length > 1"
        @cancel="toggleCreateNewMemberModal"
        @submit="updateList"
        @delete-module="toggleDeleteModal($event)"
      />
    </transition-modal>

    <transition-modal>
      <delete-modal
        v-if="isShownDeleteModal"
        :icon="$icons.trash"
        :main-title="$t('unverified-users-item.delete-main-title')"
        :secondary-title="$t('unverified-users-item.delete-secondary-title')"
        @cancel="toggleDeleteModal"
        @delete="deleteUnverifiedUsers"
      />
    </transition-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { api } from '@/api'
import {
  AppButton,
  VerifyUserModal,
  DeleteModal,
  TransitionModal,
} from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { Bus, ErrorHandler, formatDMYHM } from '@/helpers'
import { useAuthStore, usePlatformStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useContext } from '@/composables'

const props = defineProps<{
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'update'): void
  (e: 'cancel'): void
}>()

const { $t } = useContext()
const { modules } = storeToRefs(usePlatformStore())
const { currentUserId } = useAuthStore()
const isShownDeleteModal = ref(false)
const isShownVerifyUserModal = ref(false)
const currentModule = ref(props.user.module[0])
const userName = computed(
  () => props.user.name ?? $t('unverified-users-item.unverified-name'),
)

const toggleCreateNewMemberModal = async () => {
  isShownVerifyUserModal.value = !isShownVerifyUserModal.value
}

const toggleDeleteModal = (module?: string) => {
  isShownDeleteModal.value = !isShownDeleteModal.value
  if (module?.length) {
    currentModule.value = module
  }
}

const updateList = () => {
  emit('update')
}

const getModuleImage = (moduleName: string) => {
  const selectedModule = modules.value.find(item => item.id === moduleName)
  return selectedModule?.icon
}

const deleteUnverifiedUsers = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: currentModule.value,
          from_user: String(currentUserId),
          to_user: String(props.user.id),
          payload: {
            action: 'delete_user',
            user_id: String(props.user.id),
            username: props.user.username,
          },
        },
        relationships: {
          user: {
            data: {
              id: String(currentUserId),
            },
          },
        },
      },
    })
    updateList()
    Bus.info($t('unverified-users-item.success-delete'))
    isShownDeleteModal.value = false
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
  border-radius: toRem(8);
}

.unverified-users-item__text {
  position: relative;
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

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }
}

.unverified-users-item__img {
  width: toRem(24);
  height: toRem(24);
  border-radius: 50%;

  &:not(:first-child) {
    position: relative;
    left: toRem(-5);
    border: toRem(1) solid var(--border-primary-main-inverted);
  }
}
</style>