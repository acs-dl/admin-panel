<template>
  <transition-modal :is-shown="isShown" @click-outside="closeModal">
    <div class="status-modal__inner">
      <div class="status-modal__header">
        <h4 class="status-modal__title">
          {{ $t('status-modal.title') }}
        </h4>
        <app-button
          class="status-modal__close-button"
          :icon-left="$icons.x"
          @click="closeModal"
        />
      </div>
      <status-modal-tabs
        class="status-modal__status-tabs"
        v-model:current-status="currentStatus"
      />
      <status-modal-list :status="currentStatus" />
    </div>
  </transition-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  TransitionModal,
  AppButton,
  StatusModalTabs,
  StatusModalList,
} from '@/common'
import { REQUEST_STATUSES } from '@/enums'

defineProps<{
  isShown: boolean
}>()

const emit = defineEmits<{
  (e: 'update:isShown', value: boolean): void
}>()

const currentStatus = ref(REQUEST_STATUSES.all)

const closeModal = () => {
  emit('update:isShown', false)
}
</script>

<style lang="scss" scoped>
.status-modal__inner {
  padding: toRem(32);
}

.status-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-modal__title {
  font-weight: 600;
  font-size: toRem(32);
}

.status-modal__status-tabs {
  margin: toRem(24) 0;
  width: fit-content;
}
</style>
