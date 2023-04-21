<template>
  <div class="verified-users-item">
    <component :is="responseItem" :user="user" @delete="toggleDeleteModal" />

    <transition-modal>
      <delete-modal
        v-if="isShownDeleteModal"
        :icon="$icons.trash"
        :main-title="$t('verified-users-item.delete-main-title')"
        :secondary-title="$t('verified-users-item.delete-secondary-title')"
        @cancel="toggleDeleteModal"
        @delete="deleteUser"
      />
    </transition-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DeleteModal, TransitionModal } from '@/common'
import VerifiedUserItemMobile from '@/pages/verified-users/VerifiedUserItemMobile.vue'
import VerifiedUserItemDesktop from '@/pages/verified-users/VerifiedUserItemDesktop.vue'
import { VerifiedUser } from '@/types'
import { useWindowSize } from '@vueuse/core'
import { WINDOW_BREAKPOINTS } from '@/enums'

const props = defineProps<{
  user: VerifiedUser
}>()

const emit = defineEmits<{
  (e: 'delete', payload: string): void
}>()

const { width } = useWindowSize()

const isShownDeleteModal = ref(false)

const responseItem = computed(() =>
  width.value > WINDOW_BREAKPOINTS.medium
    ? VerifiedUserItemDesktop
    : VerifiedUserItemMobile,
)

const toggleDeleteModal = () => {
  isShownDeleteModal.value = !isShownDeleteModal.value
}

const deleteUser = () => {
  emit('delete', props.user.id)
  isShownDeleteModal.value = false
}
</script>
