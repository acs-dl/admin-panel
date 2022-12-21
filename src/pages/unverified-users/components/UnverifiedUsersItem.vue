<template>
  <div class="unverified-users-list-item">
    <span class="unverified-users-list-item__text">
      {{ user.name }}
    </span>
    <span class="unverified-users-list-item__text">
      {{ user.position }}
    </span>
    <span class="unverified-users-list-item__text">
      {{ user.telegram || $t('unverified-users-list-item.telegram') }}
    </span>
    <span class="unverified-users-list-item__text">
      {{ new Date().toDateString() }}
    </span>

    <div class="unverified-users-list-item__buttons">
      <app-button
        class="unverified-users-list-item__btn"
        color="blue"
        :text="$t('unverified-users-list-item.verify-btn')"
        @click="removeUser"
      />
      <app-button
        class="unverified-users-list-item__btn"
        color="error"
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
.unverified-users-list-item {
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

.unverified-users-list-item__text {
  font-weight: 400;
  font-size: toRem(16);
  color: var(--text-secondary-light);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.unverified-users-list-item__buttons {
  display: flex;
  gap: toRem(25);
  justify-content: space-between;
}

.unverified-users-list-item__btn {
  font-size: toRem(16);
  font-weight: 400;
}
</style>
