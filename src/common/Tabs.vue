<template>
  <div class="tabs">
    <button
      v-for="(item, id) in tabs"
      class="tabs__btn"
      :key="id"
      :class="{ 'tabs__btn--active': modelValue === item.id }"
      @click="updateTab(item.id)"
    >
      <div class="tabs__btn-text">
        <h3 class="tabs__btn-text-title">
          {{ item.title }}
        </h3>
        <span v-if="item.message" class="tabs__btn-text-message">
          {{ item.message }}
        </span>
      </div>
      <icon class="tabs__btn-icon" :name="iconName" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type TabsType = {
  message: string
  title: string
  id: string
}

withDefaults(
  defineProps<{
    modelValue: string
    tabs: TabsType[]
    iconName?: ICON_NAMES
  }>(),
  {
    iconName: ICON_NAMES.checkCircle,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const updateTab = (id: string) => {
  emit('update:modelValue', id)
}
</script>

<style lang="scss" scoped>
.tabs {
  display: grid;
  grid-gap: toRem(12);
}

.tabs__btn {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: flex-start;
  border: toRem(1) solid var(--border-primary-light);
  border-radius: toRem(12);
  padding: toRem(16);

  &--active {
    background: var(--primary-light);
    border: toRem(1) solid var(--primary-main);
  }
}

.tabs__btn-icon {
  width: toRem(16);
  height: toRem(16);
}

.tabs__btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  grid-gap: toRem(8);
}

.tabs__btn-text-message {
  display: flex;
  text-align: left;
  font-size: toRem(14);
  max-width: toRem(200);
  font-weight: 400;
  color: var(--text-secondary-light);
}

.tabs__btn-text-title {
  font-weight: 500;
  font-size: toRem(18);
  color: var(--text-secondary-main);
}
</style>
