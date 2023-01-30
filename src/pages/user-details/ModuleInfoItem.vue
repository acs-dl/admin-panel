<template>
  <div class="module-info-item">
    <img
      class="module-info-item__img"
      :src="moduleBaseInfo?.icon"
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
    <app-button class="module-info-item__btn" @click="toggleRemoveModal">
      <icon class="module-info-item__btn-icon" :name="$icons.trash" />
    </app-button>
    <delete-modal
      v-if="isOpenRemoveModal"
      :main-title="
        $t('module-info-item.delete-main-title', { module: module.module })
      "
      :secondary-title="
        $t('module-info-item.delete-secondary-title', { module: module.module })
      "
      :icon="$icons.trash"
      @cancel="toggleRemoveModal"
      @delete="deleteUserFromModule"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { api } from '@/api'
import { AppButton, DeleteModal, Icon } from '@/common'
import { ErrorHandler, Bus } from '@/helpers'
import { ModuleInfo } from '@/types'
import { usePlatformStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useContext } from '@/composables'

const props = defineProps<{
  id: string
  module: ModuleInfo
}>()

const { $t } = useContext()
const { modules } = storeToRefs(usePlatformStore())
const moduleBaseInfo = computed(() =>
  modules.value.find(item => item.name === props.module.module),
)

const isOpenRemoveModal = ref(false)

const toggleRemoveModal = async () => {
  isOpenRemoveModal.value = !isOpenRemoveModal.value
}

const deleteUserFromModule = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: moduleBaseInfo.value?.name,
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
    Bus.info($t('module-info-item.success-delete'))
    isOpenRemoveModal.value = false
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>

<style scoped lang="scss">
.module-info-item {
  display: grid;
  grid-template-columns: toRem(40) minmax(toRem(100), 1fr) toRem(20);
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

.module-info-item__btn-icon {
  max-width: toRem(20);
  max-height: toRem(24);
}
</style>
