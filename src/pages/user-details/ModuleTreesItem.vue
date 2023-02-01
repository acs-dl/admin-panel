<template>
  <ul class="module-tree-item__wrapper">
    <li class="module-tree-item">
      <app-button
        color="default"
        class="module-tree-item__name"
        @click="toggleTree"
      >
        <div class="module-tree-item__name-text">
          {{ item?.path }}
        </div>
        <icon
          v-if="isFolder"
          class="module-tree-item__name-icon"
          :class="{ 'module-tree-item__name-icon--open': isOpenTree }"
          :name="$icons.chevronFullDown"
        />
      </app-button>

      <app-button
        v-if="item.access_level"
        class="module-tree-item__item-btn"
        color="blue"
        :text="item.access_level?.name"
        @click="togglePermissionModal"
      />

      <app-button
        class="module-tree-item__item-btn"
        color="error"
        :text="$t('module-tree-item.delete-btn')"
        @click="toggleDeleteModal"
      />
    </li>
    <template v-if="isOpenTree">
      <module-trees-item
        v-for="(child, index) in children"
        :key="index"
        :id="id"
        :module-name="moduleName"
        :item="child"
      />
    </template>
    <permission-modal
      :is-shown="isShownPermissionrModal"
      :id="id"
      :module="item"
      :module-name="moduleName"
      @submit="reloadPermissionModal"
      @cancel="togglePermissionModal"
    />
    <delete-modal
      :is-shown="isShownDeleteModal"
      :icon="$icons.trash"
      :main-title="
        $t('module-tree-item.delete-main-title', { module: moduleName })
      "
      :secondary-title="
        $t('module-tree-item.delete-secondary-title', {
          module: moduleName,
          link: item.link,
        })
      "
      @cancel="toggleDeleteModal"
      @delete="deleteUserFromModule"
    />
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { api } from '@/api'
import { AppButton, Icon, PermissionModal, DeleteModal } from '@/common'
import { ErrorHandler } from '@/helpers'
import { UserPermisonInfo } from '@/types'
import { Bus } from '@/helpers'
import { useContext } from '@/composables'
import ModuleTreesItem from './ModuleTreesItem.vue'

const props = defineProps<{
  moduleName: string
  id: string
  item: UserPermisonInfo
}>()

const { $t } = useContext()
const isShownDeleteModal = ref(false)
const isShownPermissionrModal = ref(false)
const isOpenTree = ref(false)
const children = ref<UserPermisonInfo[]>([])
const isFolder = computed(() => props.item.deployable)

const toggleTree = async () => {
  try {
    if (isFolder.value && !children.value.length) {
      const { data } = await api.get<UserPermisonInfo[]>(
        `/integrations/${props.moduleName}/permissions`,
        {
          filter: {
            userId: props.id,
            link: props.item.link,
          },
        },
      )
      children.value = data
    }
    isOpenTree.value = !isOpenTree.value
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const togglePermissionModal = () => {
  isShownPermissionrModal.value = !isShownPermissionrModal.value
}

const reloadPermissionModal = () => {
  isShownPermissionrModal.value = false
}

const toggleDeleteModal = () => {
  isShownDeleteModal.value = !isShownDeleteModal.value
}

const deleteUserFromModule = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: props.moduleName,
          payload: {
            action: 'remove_user',
            user_id: String(props.id),
            link: props.item.link,
            username: props.item.username,
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
    Bus.info($t('module-tree-item.success-delete'))
    isShownDeleteModal.value = false
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>

<style scoped lang="scss">
.module-tree-item__wrapper {
  line-height: 1.5em;
  position: relative;
  padding-left: 0.8em;

  &:not(:last-child) {
    border-left: toRem(1) solid var(--border-primary-light);
  }

  &:before {
    content: '';
    position: absolute;
    top: -0.1em;
    left: 0;
    width: 0.5em;
    height: 1em;
    border-bottom: toRem(1) solid var(--border-primary-light);
    border-bottom-left-radius: 50%;
  }

  &:last-child:before {
    border-left: toRem(1) solid var(--border-primary-light);
  }
}

.module-tree-item {
  display: grid;
  grid-template-columns:
    minmax(toRem(100), 1fr)
    minmax(toRem(100), toRem(150))
    toRem(100);
  gap: toRem(10);
}

.module-tree-item__name {
  white-space: nowrap;
  align-items: center;
  gap: toRem(4);
}

.module-tree-item__name-text {
  max-width: toRem(200);
  text-align: start;
  font-weight: 400;
  line-height: 1.2;

  @include text-ellipsis;
}

.module-tree-item__name-icon {
  width: toRem(10);
  height: toRem(10);
  transition: linear 0.1s;
  transform: rotate(-90deg);
  color: var(--text-primary-light);

  &--open {
    transform: rotate(0);
  }
}

.module-tree-item__item-btn {
  font-weight: 400;
}
</style>
