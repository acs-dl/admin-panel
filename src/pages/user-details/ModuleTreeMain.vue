<template>
  <ul class="module-tree-main__wrapper">
    <li class="module-tree-main">
      <app-button
        color="default"
        class="module-tree-main__name"
        @click="toggleModuleTree"
      >
        <span class="module-tree-main__name-text">
          {{ module.type }}
        </span>
        <icon
          class="module-tree-main__name-icon"
          :class="{ 'module-tree-main__name-icon--open': isOpenModuleTree }"
          :name="$icons.chevronFullRight"
        />
      </app-button>

      <div>
        <span v-if="!isOpenModuleTree">
          {{ $t('module-tree-main.submodule-column') }}
        </span>
      </div>
      <div>
        <span v-if="!isOpenModuleTree">
          {{ $t('module-tree-main.access-level-column') }}
        </span>
      </div>
      <app-button
        class="module-tree-main__item-btn"
        color="error"
        :text="$t('module-tree-main.delete-btn')"
        @click="toggleDeleteModal"
      />
    </li>
    <ul v-if="isOpenModuleTree" class="module-tree-main__children">
      <module-trees-item
        v-for="(child, index) in module.children"
        class="module-tree-main__children-item"
        :key="index"
        :id="module.id"
        :module-name="module.type"
        :item="child"
      />
    </ul>
    <delete-modal
      :is-shown="isShownDeleteModal"
      :icon="$icons.trash"
      :main-title="
        $t('module-tree-main.delete-main-title', { module: module.type })
      "
      :secondary-title="
        $t('module-tree-main.delete-secondary-title', { module: module.type })
      "
      @cancel="toggleDeleteModal"
      @delete="deleteUserFromModule"
    />
  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AppButton, Icon, DeleteModal } from '@/common'
import { ModuleTree } from '@/types'
import ModuleTreesItem from './ModuleTreesItem.vue'
import { api } from '@/api'
import { ErrorHandler, Bus } from '@/helpers'
import { useContext } from '@/composables'

const props = defineProps<{
  module: ModuleTree
}>()

const { $t } = useContext()
const isShownDeleteModal = ref(false)
const isOpenModuleTree = ref(false)

const toggleModuleTree = () => {
  isOpenModuleTree.value = !isOpenModuleTree.value
}

const toggleDeleteModal = () => {
  isShownDeleteModal.value = !isShownDeleteModal.value
}

const deleteUserFromModule = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: props.module.type,
          payload: {
            action: 'delete_user',
            user_id: String(props.module.id),
            username: props.module.children[0]?.username,
          },
        },
        relationships: {
          user: {
            data: {
              id: '1',
            },
          },
        },
      },
    })
    Bus.info($t('module-tree-main.success-delete'))
    isShownDeleteModal.value = false
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>

<style scoped lang="scss">
.module-tree-main__wrapper {
  padding-left: 0.5em;
  line-height: 1.5em;
}

.module-tree-main {
  display: grid;
  grid-template-columns:
    toRem(100)
    minmax(toRem(100), 1fr)
    minmax(toRem(100), toRem(150))
    toRem(100);
  gap: toRem(10);
}

.module-tree-main__name {
  align-items: center;
  gap: toRem(4);
}

.module-tree-main__name-text {
  font-weight: 400;
}

.module-tree-main__name-icon {
  width: toRem(8);
  height: toRem(8);
  transition: linear 0.1s;

  &--open {
    transform: rotate(90deg);
  }
}

.module-tree-main__children {
  margin-left: toRem(110);
}

.module-tree-main__children-item {
  padding-left: 0;

  &:not(:last-child) {
    border: none;
  }

  &:last-child:before {
    border: none;
  }
}

.module-tree-main__item-btn {
  font-weight: 400;
}
</style>
