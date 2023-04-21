<template>
  <ul class="module-tree-main__wrapper">
    <input-field
      v-if="isOpenModuleTree"
      scheme="tertiary"
      class="module-tree-main__search"
      v-model="searchValue"
      :placeholder="$t('module-tree-main.search-placeholder')"
      :icon-left="$icons.search"
      :icon-right="iconRight"
      @right-icon-click="clearInput"
      @keyup.enter="updateList"
      @blur="updateList"
    />
    <li class="module-tree-main">
      <app-button
        color="default"
        class="module-tree-main__name"
        :disabled="!module.children.length"
        @click="toggleModuleTree"
      >
        <img
          class="module-tree-main__module-icon"
          :src="moduleIcon"
          :alt="$t('module-tree-main.icon-description')"
        />
        <span class="module-tree-main__name-text">
          {{ moduleName }}
        </span>
        <icon
          v-if="module.children.length"
          class="module-tree-main__name-icon"
          :class="{ 'module-tree-main__name-icon--open': isOpenModuleTree }"
          :name="$icons.chevronFullRight"
        />
      </app-button>

      <template v-if="!isOpenModuleTree">
        <div class="module-tree-main__column-wrapper">
          <span class="module-tree-main__column-text">
            {{ $t('module-tree-main.submodule-column') }}
          </span>
        </div>
        <div class="module-tree-main__column-wrapper">
          <span class="module-tree-main__column-text">
            {{ $t('module-tree-main.access-level-column') }}
          </span>
        </div>
        <app-button
          class="module-tree-main__item-btn"
          color="gray"
          :icon-left="$icons.trash"
          @click="toggleDeleteModal"
        />
      </template>
    </li>
    <li v-show="isOpenModuleTree" class="module-tree-main__children">
      <span class="module-tree-main__children-title">
        {{ $t('module-tree-main.submodule-column') }}
      </span>
      <module-trees-item
        v-for="(child, index) in module.children"
        class="module-tree-main__children-item"
        v-model:is-shown="isOpenModuleTree"
        :key="index"
        :id="module.id"
        :module-name="module.type"
        :item="child"
        :is-was-found="module.isWasFound"
        :search-value="searchValue"
      />
    </li>
    <app-button
      class="module-tree-main__delete-button"
      color="error"
      :text="$t('module-tree-main.delete-button')"
      @click="toggleDeleteModal"
    />
    <transition-modal>
      <delete-modal
        v-if="isShownDeleteModal"
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
    </transition-modal>
  </ul>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { AppButton, Icon, DeleteModal, TransitionModal } from '@/common'
import { ModuleTree, UserModuleSearch } from '@/types'
import { api } from '@/api'
import { ErrorHandler, Bus } from '@/helpers'
import { useContext } from '@/composables'
import { useAuthStore, usePlatformStore } from '@/store'
import { InputField } from '@/fields'
import ModuleTreesItem from './ModuleTreesItem.vue'
import { ICON_NAMES } from '@/enums'

const props = defineProps<{
  module: ModuleTree
}>()

const emit = defineEmits<{
  (e: 'updateList', value: UserModuleSearch): void
}>()

const { $t } = useContext()
const { modules } = usePlatformStore()
const { currentUserId } = useAuthStore()
const isShownDeleteModal = ref(false)
const isOpenModuleTree = ref(false)
const searchValue = ref('')

const moduleIcon = computed(
  () => modules.find(el => el.id === props.module.type)?.icon ?? '',
)

const iconRight = computed(() => (searchValue.value ? ICON_NAMES.x : undefined))

const moduleName = computed(
  () => modules.find(el => el.id === props.module.type)?.name ?? '',
)

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
          from_user: String(currentUserId),
          to_user: String(props.module.id),
          payload: {
            action: 'delete_user',
            user_id: String(props.module.id),
            username: props.module.children[0]?.username,
          },
        },
        relationships: {
          user: {
            data: {
              id: String(currentUserId),
            },
          },
        },
      },
    })
    Bus.info($t('module-tree-main.success-delete'))
    isShownDeleteModal.value = false
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const clearInput = () => {
  searchValue.value = ''
  updateList()
}

const updateList = () => {
  emit('updateList', {
    searchValue: searchValue.value,
    moduleName: props.module.type,
  })
}
</script>

<style scoped lang="scss">
.module-tree-main__wrapper {
  padding-left: 0.5em;
  line-height: 1.5em;

  @include respond-to(tablet) {
    padding: 0;
  }
}

.module-tree-main {
  display: grid;
  grid-template-columns:
    toRem(150)
    minmax(toRem(100), 1fr)
    minmax(toRem(100), toRem(150))
    toRem(100);
  gap: toRem(10);

  @include respond-to(tablet) {
    display: block;
    padding: toRem(12);
  }
}

.module-tree-main__name {
  width: toRem(125);
  display: grid;
  grid-template-columns: toRem(24) minmax(toRem(75), 1fr) toRem(8);
  align-items: center;
  gap: toRem(8);
  text-transform: capitalize;

  &:disabled,
  &--disabled {
    filter: none;
    opacity: 1;
  }

  @include respond-to(tablet) {
    display: flex;
    width: 100%;
    justify-content: flex-start;
  }
}

.module-tree-main__name-text {
  font-weight: 400;
  text-align: left;

  @include respond-to(tablet) {
    font-size: toRem(14);
  }
}

.module-tree-main__name-icon {
  width: toRem(8);
  height: toRem(8);
  transition: linear 0.1s;

  &--open {
    transform: rotate(90deg);
  }

  @include respond-to(tablet) {
    margin-left: auto;
  }
}

.module-tree-main__children {
  margin-left: toRem(120);

  @include respond-to(tablet) {
    padding: toRem(12);
    margin-left: 0;
    border-top: toRem(1) solid var(--border-primary-light);
  }
}

.module-tree-main__item-btn {
  font-weight: 400;
  margin-left: auto;
  padding-right: toRem(10);

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }

  @include respond-to(tablet) {
    display: none;
  }
}

.module-tree-main__collection-loader {
  margin-top: toRem(10);
  display: flex;
  justify-content: center;
}

.module-tree-main__search {
  max-width: toRem(265);
  margin-bottom: toRem(24);

  @include respond-to(tablet) {
    display: none;
  }
}

.module-tree-main__module-icon {
  width: toRem(24);
  height: toRem(24);
}

.module-tree-main__column-wrapper {
  @include respond-to(tablet) {
    display: none;
  }
}

.module-tree-main__children-title {
  display: none;

  @include respond-to(tablet) {
    display: block;
    font-size: toRem(14);
    color: var(--text-primary-light);
    margin-bottom: toRem(16);
  }
}

.module-tree-main__delete-button {
  display: none;

  @include respond-to(tablet) {
    display: flex;
    width: 100%;
    padding: toRem(12);
    border-top: toRem(1) solid var(--border-primary-light);
    font-weight: 400;
    font-size: toRem(14);

    &:not([disabled]):hover,
    &:not([disabled]):focus,
    &:not([disabled]):active {
      border-top: toRem(1) solid var(--border-primary-light);
    }
  }
}
</style>
