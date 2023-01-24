<template>
  <div class="module-info-item">
    <img
      class="module-info-item__img"
      :src="module.avatar"
      :alt="module.module"
    />
    <div class="module-info-item__details">
      <h5 class="module-info-item__details-module-name">
        {{ module.module }}
      </h5>
      <p class="module-info-item__details-nickname">
        {{ module.username }}
      </p>
    </div>
    <app-button
      class="module-info-item__btn"
      :icon-left="$icons.trash"
      @click="toggleRemoveModal"
    />
    <delete-modal
      v-if="isOpenRemoveModal"
      :icon="$icons.trash"
      @cancel="toggleRemoveModal"
      @confirm="deleteUserFromModule"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { api } from '@/api'
import { AppButton, DeleteModal } from '@/common'
import { ErrorHandler } from '@/helpers'
import { ModuleInfo } from '@/types'

const props = defineProps<{
  id: string
  module: ModuleInfo
}>()

const isOpenRemoveModal = ref(false)

const toggleRemoveModal = async () => {
  isOpenRemoveModal.value = !isOpenRemoveModal.value
}

const deleteUserFromModule = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: 'gitlab' ?? props.module.module,
          payload: {
            action: 'delete_user',
            user_id: String(props.id),
            username: props.module.username,
          },
        },
        relationships: {
          user: {
            data: {
              id: String(props.id),
            },
          },
        },
      },
    })
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>

<style scoped lang="scss">
.module-info-item {
  display: grid;
  grid-template-columns: toRem(40) minmax(toRem(100), 1fr) toRem(50);
  gap: toRem(8);
  align-items: end;

  &:not(:last-child) {
    margin-bottom: toRem(24);
  }
}

.module-info-item__img {
  max-width: toRem(40);
  max-height: toRem(40);
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.module-info-item__details {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: toRem(4);
}

.module-info-item__details-module-name,
.module-info-item__details-nickname,
.module-info-item__btn {
  font-size: toRem(14);
  font-weight: 400;
  line-height: 1.2;
}

.module-info-item__details-nickname {
  color: var(--text-secondary-light);
}

.module-info-item__btn {
  color: var(--text-primary-light);
}
</style>
