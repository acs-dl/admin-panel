<template>
  <div class="unverified-users-item-desktop">
    <span class="unverified-users-item-desktop__text" :title="usersName">
      {{ usersName }}
    </span>
    <span class="unverified-users-item-desktop__text" :title="user.username">
      {{ user.username }}
    </span>
    <span class="unverified-users-item-desktop__text">
      <app-button
        class="unverified-users-item-desktop__modules-btn"
        :class="{
          'unverified-users-item-desktop__modules-btn--open': isOpenTree,
        }"
        :icon-right="$icons.chevronFullDown"
        @click="isOpenTree = !isOpenTree"
      >
        <img
          v-for="(module, idx) in user.module"
          :key="idx"
          class="unverified-users-item-desktop__img"
          :src="getModuleImage(module)"
          :alt="user.module[idx]"
        />
      </app-button>
    </span>
    <span
      class="unverified-users-item-desktop__text"
      :title="formatDMYHM(user.created_at)"
    >
      {{ formatDMYHM(user.created_at) }}
    </span>

    <div class="unverified-users-item-desktop__buttons">
      <app-button
        class="unverified-users-item-desktop__btn"
        color="blue"
        :text="$t('unverified-users-item.verify-btn')"
        @click="createMember"
      />
      <app-button
        class="unverified-users-item-desktop__btn"
        color="gray"
        :icon-left="$icons.trash"
        @click="deleteMember"
      />
    </div>
    <div v-if="isOpenTree" class="unverified-users-item-desktop__modules">
      <div
        v-for="(module, idx) in user.module"
        :key="idx"
        class="unverified-users-item-desktop__module"
      >
        <unverified-user-module-item :module-name="module" :user="user" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { AppButton } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { formatDMYHM } from '@/helpers'
import { usePlatformStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useContext } from '@/composables'
import UnverifiedUserModuleItem from './UnverifiedUserModuleItem.vue'

const props = defineProps<{
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'delete'): void
  (e: 'create-member'): void
}>()

const { $t } = useContext()
const { modules } = storeToRefs(usePlatformStore())
const isOpenTree = ref(false)
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
.unverified-users-item-desktop {
  display: grid;
  grid-gap: toRem(10);
  grid-template-columns: repeat(4, minmax(toRem(50), 1fr)) toRem(190);
  padding: toRem(24);
  align-items: center;
  height: 100%;
  background: var(--background-secondary-main);
  margin-bottom: toRem(8);
  border-radius: toRem(8);
}

.unverified-users-item-desktop__text {
  position: relative;
  font-weight: 400;
  font-size: toRem(16);
  line-height: 1.2;
  color: var(--text-secondary-light);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.unverified-users-item-desktop__modules-btn {
  gap: toRem(8);

  :deep(.icon) {
    color: var(--text-primary-main);
    transition: linear 0.1s;
    height: toRem(10);
    width: toRem(10);
  }

  &--open {
    :deep(.icon) {
      transform: rotate(-180deg);
    }
  }
}

.unverified-users-item-desktop__buttons {
  display: flex;
  gap: toRem(25);
  justify-content: space-between;
}

.unverified-users-item-desktop__btn {
  font-size: toRem(16);
  font-weight: 400;

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }
}

.unverified-users-item-desktop__img {
  width: toRem(24);
  height: toRem(24);
  border-radius: 50%;

  &:not(:first-child) {
    position: relative;
    left: toRem(-5);
    border: toRem(1) solid var(--border-primary-main-inverted);
  }
}

.unverified-users-item-desktop__modules {
  display: grid;
  grid-gap: inherit;
  grid-row: 2;
  grid-column: 3 / 6;
}
</style>
