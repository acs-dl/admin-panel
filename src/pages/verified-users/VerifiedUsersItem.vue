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
        color="gray"
        :icon-left="$icons.trash"
        @click="toggleDeleteModal"
      />
    </div>

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
import { ref } from 'vue'
import { AppButton, DeleteModal, TransitionModal } from '@/common'
import { VerifiedUser } from '@/types'

const props = defineProps<{
  user: VerifiedUser
}>()

const emit = defineEmits<{
  (e: 'delete', payload: string): void
}>()

const isShownDeleteModal = ref(false)

const toggleDeleteModal = () => {
  isShownDeleteModal.value = !isShownDeleteModal.value
}

const deleteUser = () => {
  emit('delete', props.user.id)
  isShownDeleteModal.value = false
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
  border-radius: toRem(8);
}

.verified-users-item__text {
  max-width: 100%;
  display: inline;
  font-weight: 400;
  font-size: toRem(16);
  line-height: 1.2;
  color: var(--text-secondary-light);
  justify-content: left;

  @include text-ellipsis;

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

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }
}
</style>
