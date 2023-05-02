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
          {{ $t('module-trees.delete-text') }}
        </span>
      </div>
    </div>

    <div class="module-trees__content">
      <div v-if="moduleTreesList.length" class="module-trees__item-wrapper">
        <module-tree-main
          v-for="(item, idx) in moduleTreesList"
          v-model:search-value="searchValue"
          class="module-trees__item"
          :key="idx"
          :module="item"
          :submodule-names="submoduleNames"
          @update-list="emit('updateList', $event)"
        />
      </div>
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
import { ref } from 'vue'
import { NoDataMessage } from '@/common'
import { ModuleTree, SubmoduleName, UserModuleSearch } from '@/types'
import ModuleTreeMain from './ModuleTreeMain.vue'

defineProps<{
  id: string
  moduleTreesList: ModuleTree[]
  submoduleNames: SubmoduleName[]
}>()

const emit = defineEmits<{
  (e: 'updateList', value: UserModuleSearch): void
}>()

const searchValue = ref('')
</script>

<style scoped lang="scss">
.module-trees {
  width: 100%;
  background: var(--app-bg-tertiary);
  border-radius: toRem(15);
  color: var(--text-secondary-main);
}

.module-trees__header {
  padding: toRem(12) toRem(24);
  display: grid;
  align-items: center;
  grid-template-columns:
    toRem(150)
    minmax(toRem(100), 1fr)
    minmax(toRem(100), toRem(150))
    toRem(100);
  gap: toRem(10);

  @include respond-to(tablet) {
    display: none;
  }
}

.module-trees__header-item {
  &:last-child {
    text-align: right;
  }
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

.module-trees__item-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(16);
}

.module-trees__item {
  background: var(--white);
  border-radius: toRem(8);
  padding: toRem(24);

  @include respond-to(tablet) {
    padding: 0;
  }
}
</style>
