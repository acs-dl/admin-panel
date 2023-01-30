<template>
  <div class="verified-users-item">
    <app-button
      :class="['verified-users-item__text', 'verified-users-item__text--name']"
      :route="{ name: $routes.userDetails, params: { id: user.id } }"
      color="blue"
      :text="`${user.name} ${user.surname}`"
    />
    <span class="verified-users-item__text">
      {{ user.position }}
    </span>
    <span class="verified-users-item__text">
      {{ user.telegram || $t('verified-users-item.telegram') }}
    </span>

    <div class="verified-users-item__buttons">
      <app-button
        class="verified-users-item__btn"
        color="error"
        :icon-left="$icons.trash"
        @click="toggleRemoveModal"
      />
    </div>

    <delete-modal
      v-if="isOpenRemoveModal"
      @cancel="toggleRemoveModal"
      @delete="deleteUser"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppButton, DeleteModal } from '@/common'
import { VerifiedUser } from '@/types'

const props = defineProps<{
  user: VerifiedUser
}>()

const emit = defineEmits<{
  (e: 'delete', payload: string): void
}>()

const isOpenRemoveModal = ref(false)

const toggleRemoveModal = () => {
  isOpenRemoveModal.value = !isOpenRemoveModal.value
}

const deleteUser = () => {
  emit('delete', props.user.id)
  isOpenRemoveModal.value = false
}
</script>

<style lang="scss" scoped>
.verified-users-item {
  display: grid;
  grid-column-gap: toRem(10);
  grid-template-columns: repeat(3, minmax(toRem(100), 1fr)) toRem(250);
  padding: toRem(24);
  align-items: center;
  max-height: toRem(72);
  height: 100%;
  background: var(--background-primary-light);
  margin-bottom: toRem(8);
}

.verified-users-item__text {
  font-weight: 400;
  font-size: toRem(16);
  line-height: 1.2;
  color: var(--text-secondary-light);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  &--name {
    color: var(--primary-main);
  }
}

.verified-users-item__buttons {
  display: flex;
  gap: toRem(25);
  justify-content: flex-end;
  padding: 0 toRem(20);
}

.verified-users-item__btn {
  font-size: toRem(16);
}
</style>
