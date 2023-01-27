<template>
  <div class="module-trees">
    <div class="module-trees__header">
      <div class="module-trees__header-item">
        <span class="module-trees__header-item-text">
          {{ $t('module-trees.module-text') }}
        </span>
      </div>
      <div class="module-trees__header-item">
        <span class="module-trees__header-item-text">
          {{ $t('module-trees.submodule-text') }}
        </span>
      </div>
      <div class="module-trees__header-item">
        <span class="module-trees__header-item-text">
          {{ $t('module-trees.access-level-text') }}
        </span>
      </div>
      <div class="module-trees__header-item">
        <span class="module-trees__header-item-text">
          {{ $t('module-trees.edit-text') }}
        </span>
      </div>
    </div>

    <div class="module-trees__content">
      <template v-if="moduleTreesList.length">
        <module-trees-item
          v-for="item in moduleTreesList"
          class="module-trees__item"
          is-module-level
          :key="item"
          :id="id"
          :item="item"
          :module-name="item.type"
        />
      </template>
      <template v-else>
        <no-data-message
          class="module-trees__message"
          :title="$t('module-trees.no-data-title')"
          :message="$t('module-trees.no-data-message')"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NoDataMessage } from '@/common'
import ModuleTreesItem from './ModuleTreesItem.vue'

defineProps<{
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moduleTreesList: any[] // fix
}>()
</script>

<style scoped lang="scss">
.module-trees {
  width: 100%;
  background: var(--app-bg-tertiary);
  border-radius: toRem(15);
  color: var(--text-secondary-main);
}

.module-trees__header {
  padding: toRem(20);
  display: grid;
  align-items: center;
  grid-template-columns:
    toRem(100)
    minmax(toRem(100), 1fr)
    repeat(2, toRem(100));
}

.module-trees__header-item-text {
  font-size: toRem(16);
  color: var(--text-primary-light);
}

.module-trees__content {
  min-height: toRem(540);
}

.module-trees__message {
  margin-top: toRem(50);
}

.module-trees__item {
  background: var(--white);
  border-radius: toRem(8);
  padding: toRem(24);
}
</style>
