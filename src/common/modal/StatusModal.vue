<template>
  <modal
    class="status-modal"
    is-close-by-click-outside
    is-center
    @click-outside="emit('close')"
  >
    <div class="status-modal__inner">
      <div class="status-modal__header">
        <h4 class="status-modal__title">
          {{ $t('status-modal.title') }}
        </h4>
        <app-button
          class="status-modal__close-button"
          :icon-left="$icons.x"
          @click="emit('close')"
        />
      </div>
      <status-modal-tabs
        class="status-modal__status-tabs"
        v-model:current-status="currentStatus"
      />
      <status-modal-list :status="currentStatus" />
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppButton, StatusModalTabs, StatusModalList, Modal } from '@/common'
import { REQUEST_STATUSES } from '@/enums'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const currentStatus = ref(REQUEST_STATUSES.all)
</script>

<style lang="scss" scoped>
.status-modal {
  &:deep(.modal__pane) {
    height: calc(100% - #{toRem(30)});
  }

  @include respond-to(medium) {
    &:deep(.modal__pane) {
      height: auto;
    }
  }
}

.status-modal__inner {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: toRem(32);

  @include respond-to(medium) {
    min-width: toRem(500);
  }

  @include respond-to(small) {
    min-width: auto;
    padding: toRem(12);
  }
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
