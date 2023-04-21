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
      <icon
        class="tabs__btn-icon"
        :name="
          modelValue === item.id ? $icons.selectedCircle : $icons.emptyCircle
        "
        :class="{ 'tabs__btn-icon--active': modelValue === item.id }"
      />
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
    iconName: ICON_NAMES.selectedCircle,
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

  @include respond-to(xsmall) {
    display: flex;
    flex-direction: column;
  }
}

.tabs__btn {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: flex-start;
  border: toRem(1) solid var(--border-primary-light);
  border-radius: toRem(12);
  padding: toRem(16) toRem(24) toRem(16) toRem(16);

  &--active {
    background: var(--background-tertiary-light);
    border: toRem(2) solid var(--primary-main);
  }
}

.tabs__btn-icon {
  position: absolute;
  right: toRem(16);
  top: toRem(16);
  width: toRem(16);
  height: toRem(16);

  &--active {
    color: var(--white);
  }
}

.tabs__btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  grid-gap: toRem(5);
}

.tabs__btn-text-message {
  display: flex;
  text-align: left;
  font-size: toRem(13);
  max-width: toRem(268);
  font-weight: 400;
  color: var(--text-secondary-light);
}

.tabs__btn-text-title {
  font-weight: 500;
  font-size: toRem(14);
  color: var(--text-secondary-main);
  text-align: left;
}
</style>
