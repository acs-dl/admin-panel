<template>
  <div class="verified-users-list-item">
    <span class="verified-users-list-item__text">
      {{ user.name }}
    </span>
    <span class="verified-users-list-item__text">
      {{ user.position }}
    </span>
    <span class="verified-users-list-item__text">
      {{ user.telegram || $t('verified-users-list-item.telegram') }}
    </span>

    <div class="verified-users-list-item__buttons">
      <app-button
        class="verified-users-list-item__delete-btn"
        :icon-left="$icons.trash"
        @click="removeUser"
      />
    </div>

    <modal
      v-if="isOpenRemoveModal"
      :icon="$icons.trash"
      @cancel="toggleRemoveModal"
      @confirm="removeUser"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppButton, Modal } from '@/common'
import { VerifiedUser } from '@/types'

const props = defineProps<{
  user: VerifiedUser
}>()

enum EVENTS {
  delete = 'delete',
}

const emit = defineEmits<{
  (e: EVENTS.delete, payload: string): void
}>()

const isOpenRemoveModal = ref(false)

const toggleRemoveModal = () => {
  isOpenRemoveModal.value = !isOpenRemoveModal.value
}

const removeUser = () => {
  emit(EVENTS.delete, props.user.id)
  isOpenRemoveModal.value = false
}
</script>

<style lang="scss" scoped>
.verified-users-list-item {
  display: grid;
  grid-column-gap: toRem(10);
  grid-template-columns: repeat(3, minmax(toRem(100), 1fr)) toRem(150);
  padding: toRem(24);
  align-items: center;
  max-height: toRem(72);
  height: 100%;
  background: var(--background-primary-light);
  margin-bottom: toRem(8);
}

.verified-users-list-item__text {
  font-weight: 500;
  font-size: toRem(15);
  color: var(--text-primary-main);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.verified-users-list-item__buttons {
  display: flex;
  gap: toRem(25);
  justify-content: flex-end;
  padding: 0 toRem(20);
}

.verified-users-list-item__delete-btn {
  font-size: toRem(16);
  color: var(--error-main);

  &:hover {
    color: var(--error-dark);
  }

  &:active {
    color: var(--error-light);
  }
}
</style>
