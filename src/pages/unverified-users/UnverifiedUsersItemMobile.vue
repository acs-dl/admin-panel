<template>
  <div class="unverified-users-item-mobile" :title="usersName">
    <app-accordion>
      <template #head="{ accordion }">
        <app-button
          class="unverified-users-item-mobile__accordion-button"
          color="blue"
          :title="usersName"
          @click="accordion.toggle"
        >
          <div class="unverified-users-item-mobile__name-wrapper">
            <span class="unverified-users-item-mobile__name">
              {{ usersName }}
            </span>
            <span class="unverified-users-item-mobile__username">
              {{ $filter.username(user.username) }}
            </span>
          </div>
          <icon
            class="unverified-users-item-mobile__name-icon"
            :class="{
              'unverified-users-item-mobile__name-icon--open': accordion.isOpen,
            }"
            :name="$icons.chevronFullRight"
          />
        </app-button>
      </template>
      <div class="unverified-users-item-mobile__accordion-body">
        <div class="unverified-users-item-mobile__accordion-content">
          <span class="unverified-users-item-mobile__accordion-content-text">
            {{ $t('unverified-users-item-mobile.modules-text') }}
          </span>
          <div class="unverified-users-item-mobile__img-wrapper">
            <img
              v-for="(module, idx) in user.module"
              :key="idx"
              class="unverified-users-item-mobile__img"
              :src="getModuleImage(module)"
              :alt="user.module[idx]"
            />
          </div>
        </div>
        <div class="unverified-users-item-mobile__accordion-content">
          <span class="unverified-users-item-mobile__accordion-content-text">
            {{ $t('unverified-users-item-mobile.date-text') }}
          </span>
          <span class="unverified-users-item-mobile__accordion-content-value">
            {{ formatDMYHM(user.created_at) }}
          </span>
        </div>
        <div class="unverified-users-item-mobile__actions">
          <app-button
            class="unverified-users-item-mobile__button"
            color="blue"
            :text="$t('unverified-users-item-mobile.verify-text')"
            @click="createMember"
          />
          <app-button
            class="unverified-users-item-mobile__button"
            color="error"
            :text="$t('unverified-users-item-mobile.delete-text')"
            @click="deleteMember"
          />
        </div>
      </div>
    </app-accordion>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { AppButton, AppAccordion, Icon } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { formatDMYHM } from '@/helpers'
import { usePlatformStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useContext } from '@/composables'

const props = defineProps<{
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'create-member'): void
}>()

const { $t } = useContext()
const { modules } = storeToRefs(usePlatformStore())
const usersName = computed(
  () => props.user.name ?? $t('unverified-users-item.unverified-name'),
)

const deleteMember = () => {
  emit('delete')
}

const createMember = () => {
  emit('create-member')
}

const getModuleImage = (moduleName: string) =>
  modules.value.find(item => item.id === moduleName)?.icon
</script>

<style lang="scss" scoped>
.unverified-users-item-mobile {
  height: 100%;
  background: var(--background-secondary-main);
  margin-bottom: toRem(12);
  border-radius: toRem(12);
}

.unverified-users-item-mobile__name-icon {
  max-width: toRem(7);
  color: var(--text-primary-main);
  transition: linear 0.1s;
  transform: rotate(-90deg);

  &--open {
    transform: rotate(90deg);
  }
}

.unverified-users-item-mobile__accordion-button {
  width: 100%;
  max-height: toRem(67);
  justify-content: space-between;
  padding: toRem(12);
}

.unverified-users-item-mobile__accordion-body {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
  border-top: toRem(1) solid var(--border-primary-light);
  padding: toRem(12);
}

.unverified-users-item-mobile__accordion-content {
  display: flex;
  justify-content: space-between;
  padding: toRem(6) toRem(12);
}

.unverified-users-item-mobile__accordion-content-text {
  color: var(--text-primary-light);
  font-size: toRem(14);
}

.unverified-users-item-mobile__accordion-content-value {
  color: var(--text-secondary-light);
  font-size: toRem(14);
}

.unverified-users-item-mobile__button {
  font-size: toRem(14);
  font-weight: 400;
  flex: 1;
}

.unverified-users-item-mobile__img {
  width: toRem(24);
  height: toRem(24);
  border-radius: 50%;

  &:not(:first-child) {
    position: relative;
    left: toRem(-5);
    border: toRem(1) solid var(--border-primary-main-inverted);
  }
}

.unverified-users-item-mobile__name-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(4);

  @include text-ellipsis;

  @include respond-to(xsmall) {
    max-width: toRem(200);
  }
}

.unverified-users-item-mobile__name {
  text-align: left;
  font-weight: 400;
  color: var(--text-primary-main);
  font-size: toRem(14);

  @include text-ellipsis;
}

.unverified-users-item-mobile__username {
  text-align: left;
  font-weight: 400;
  color: var(--text-secondary-light);
  font-size: toRem(12);

  @include text-ellipsis;
}

.unverified-users-item-mobile__actions {
  display: flex;
  margin-top: toRem(20);
}
</style>
