<template>
  <div class="unverified-users-item">
    <component
      :is="responseItem"
      :user="user"
      @delete="toggleDeleteModal"
      @create-member="toggleCreateNewMemberModal"
    />

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
import { VerifyUserModal, DeleteModal, TransitionModal } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { Bus, ErrorHandler } from '@/helpers'
import { useAuthStore } from '@/store'
import { useContext } from '@/composables'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'
import UnverifiedUsersItemDesktop from '@/pages/unverified-users/UnverifiedUsersItemDesktop.vue'
import UnverifiedUsersItemMobile from '@/pages/unverified-users/UnverifiedUsersItemMobile.vue'

const props = defineProps<{
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'update'): void
  (e: 'cancel'): void
}>()

const { width } = useWindowSize()
const { $t } = useContext()
const { currentUserId } = useAuthStore()
const isShownDeleteModal = ref(false)
const isShownVerifyUserModal = ref(false)
const currentModule = ref(props.user.module[0])

const responseItem = computed(() =>
  width.value > WINDOW_BREAKPOINTS.medium
    ? UnverifiedUsersItemDesktop
    : UnverifiedUsersItemMobile,
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
