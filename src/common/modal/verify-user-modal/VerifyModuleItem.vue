<template>
  <div class="verify-module-item">
    <img
      class="verify-module-item__icon"
      :src="moduleImage"
      :alt="currentModule"
    />
    <span class="verify-module-item__submodule">
      {{ currentModule }}
    </span>
    <div class="verify-module-item__buttons">
      <app-button
        class="verify-module-item__btn"
        color="blue"
        :text="$t('verify-module-item.verify-btn')"
        @click="emit('verify-module', currentModule)"
      />
      <app-button
        class="verify-module-item__btn"
        color="gray"
        :icon-left="$icons.trash"
        @click="emit('delete-module', currentModule)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { AppButton } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { storeToRefs } from 'pinia'
import { usePlatformStore } from '@/store'

const props = defineProps<{
  currentModule: string
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'verify-module', value: string): void
  (e: 'delete-module', value: string): void
}>()

const { modules } = storeToRefs(usePlatformStore())

const moduleImage = computed(
  () => modules.value.find(item => item.id === props.currentModule)?.icon ?? '',
)
</script>

<style lang="scss" scoped>
.verify-module-item {
  display: grid;
  grid-template-columns: toRem(100) minmax(toRem(100), 1fr) toRem(150);
  padding: toRem(16) 0;
  align-items: center;
}

.verify-module-item__icon {
  max-width: toRem(32);
}

.verify-module-item__buttons {
  display: flex;
  gap: toRem(50);
  justify-content: flex-end;
  align-items: center;
}

.verify-module-item__submodule {
  color: var(--text-secondary-light);
}

.verify-module-item__btn {
  &:deep(.app-button__text) {
    font-weight: 400;
  }

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }
}
</style>
