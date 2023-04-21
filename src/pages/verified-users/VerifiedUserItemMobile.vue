<template>
  <div class="verified-users-item-mobile">
    <app-accordion>
      <template #head="{ accordion }">
        <app-button
          class="verified-users-item-mobile__accordion-button"
          color="blue"
          :title="`${user.name} ${user.surname}`"
          @click="accordion.toggle"
        >
          <router-link
            :to="{ name: $routes.userDetails, params: { id: user.id } }"
            class="verified-users-item-mobile__name"
          >
            {{ `${user.name} ${user.surname}` }}
          </router-link>
          <icon
            class="verified-users-item-mobile__name-icon"
            :class="{
              'verified-users-item-mobile__name-icon--open': accordion.isOpen,
            }"
            :name="$icons.chevronFullRight"
          />
        </app-button>
      </template>
      <template #default>
        <div class="verified-users-item-mobile__accordion-body">
          <div class="verified-users-item-mobile__accordion-content">
            <span class="verified-users-item-mobile__accordion-content-text">
              {{ $t('verified-users-item-mobile.position-text') }}
            </span>
            <span class="verified-users-item-mobile__accordion-content-value">
              {{ user.position }}
            </span>
          </div>
          <div class="verified-users-item-mobile__accordion-content">
            <span class="verified-users-item-mobile__accordion-content-text">
              {{ $t('verified-users-item-mobile.telegram-text') }}
            </span>
            <span class="verified-users-item-mobile__accordion-content-value">
              {{ $t('verified-users-item-mobile.telegram-value') }}
            </span>
          </div>
          <app-button
            class="verified-users-item-mobile__delete-button"
            color="error"
            :text="$t('verified-users-item-mobile.delete-text')"
            @click="deleteUser"
          />
        </div>
      </template>
    </app-accordion>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { VerifiedUser } from '@/types'
import AppAccordion from '@/common/AppAccordion.vue'
import Icon from '@/common/Icon.vue'

const props = defineProps<{
  user: VerifiedUser
}>()

const emit = defineEmits<{
  (e: 'delete', value: string): void
}>()

const deleteUser = () => {
  emit('delete', props.user.id)
}
</script>

<style lang="scss" scoped>
.verified-users-item-mobile {
  height: 100%;
  background: var(--background-secondary-main);
  margin-bottom: toRem(12);
  border-radius: toRem(12);
}

.verified-users-item-mobile__name {
  font-weight: 400;
  font-size: toRem(14);

  @include text-ellipsis;
}

.verified-users-item-mobile__name-icon {
  max-width: toRem(7);
  color: var(--text-primary-main);
  transition: linear 0.1s;
  transform: rotate(-90deg);

  &--open {
    transform: rotate(90deg);
  }
}

.verified-users-item-mobile__accordion-button {
  width: 100%;
  max-height: toRem(48);
  justify-content: space-between;
  padding: 0 toRem(12);
}

.verified-users-item-mobile__accordion-body {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  border-top: toRem(1) solid var(--border-primary-light);
  padding: toRem(12) 0;
}

.verified-users-item-mobile__accordion-content {
  display: flex;
  justify-content: space-between;
  padding: toRem(6) toRem(12);
}

.verified-users-item-mobile__accordion-content-text {
  color: var(--text-primary-light);
  font-size: toRem(14);
}

.verified-users-item-mobile__accordion-content-value {
  color: var(--text-secondary-light);
  font-size: toRem(14);
}

.verified-users-item-mobile__delete-button {
  font-size: toRem(14);
  font-weight: 400;
  margin: toRem(12) auto;
}
</style>
