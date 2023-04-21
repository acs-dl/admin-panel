<template>
  <div class="verified-users-item-desktop">
    <app-button
      :class="[
        'verified-users-item-desktop__text',
        'verified-users-item-desktop__text--name',
      ]"
      :route="{ name: $routes.userDetails, params: { id: user.id } }"
      color="blue"
      :text="`${user.name} ${user.surname}`"
      :title="`${user.name} ${user.surname}`"
    />
    <span class="verified-users-item-desktop__text">
      {{ user.position }}
    </span>
    <span class="verified-users-item-desktop__text">
      {{ user.telegram || $t('verified-users-item.telegram') }}
    </span>

    <div class="verified-users-item-desktop__buttons">
      <app-button
        class="verified-users-item-desktop__btn"
        color="gray"
        :icon-left="$icons.trash"
        @click="deleteUser"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { VerifiedUser } from '@/types'

defineProps<{
  user: VerifiedUser
}>()

const emit = defineEmits<{
  (e: 'delete'): void
}>()

const deleteUser = () => {
  emit('delete')
}
</script>

<style lang="scss" scoped>
.verified-users-item-desktop {
  display: grid;
  grid-column-gap: toRem(10);
  grid-template-columns: repeat(3, minmax(toRem(100), 1fr)) toRem(250);
  padding: toRem(24);
  align-items: center;
  max-height: toRem(72);
  height: 100%;
  background: var(--background-secondary-main);
  margin-bottom: toRem(8);
  border-radius: toRem(8);
}

.verified-users-item-desktop__text {
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

.verified-users-item-desktop__buttons {
  display: flex;
  gap: toRem(25);
  justify-content: flex-end;
  padding: 0 toRem(20);
}

.verified-users-item-desktop__btn {
  font-size: toRem(16);

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }
}
</style>
