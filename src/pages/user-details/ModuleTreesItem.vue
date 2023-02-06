<template>
  <ul class="module-tree-item__wrapper">
    <li class="module-tree-item">
      <div
        class="module-tree-item__name-text-wrapper"
        :style="{ marginLeft: nestingLevel + 'em' }"
      >
        <div
          v-if="!isFirstLevel"
          class="module-tree-item__level"
          :class="{ 'module-tree-item__level--last': isLast }"
        />
        <span class="module-tree-item__name-text">
          {{ item?.link }}
        </span>
      </div>

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
    <permission-modal
      :is-shown="isShownPermissionModal"
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
import { computed, ref } from 'vue'
import { api } from '@/api'
import { AppButton, PermissionModal, DeleteModal } from '@/common'
import { ErrorHandler } from '@/helpers'
import { UserPermissionInfo } from '@/types'
import { Bus } from '@/helpers'
import { useContext } from '@/composables'

const FIRST_LEVEL = 0

const props = defineProps<{
  moduleName: string
  id: string
  item: UserPermissionInfo
  isLast: boolean
  nestingLevel: number
}>()

const { $t } = useContext()
const isShownDeleteModal = ref(false)
const isShownPermissionModal = ref(false)
const isFirstLevel = computed(() => props.nestingLevel === FIRST_LEVEL)

const togglePermissionModal = () => {
  isShownPermissionModal.value = !isShownPermissionModal.value
}

const reloadPermissionModal = () => {
  isShownPermissionModal.value = false
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
}

.module-tree-item__level {
  width: 1em;
  height: 100%;
  border-left: toRem(1) solid var(--border-primary-light);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: -0.1em;
    left: -0.1em;
    width: 1em;
    height: 1em;
    border-bottom: toRem(1) solid var(--border-primary-light);
    border-bottom-left-radius: 50%;
  }

  &--last {
    height: 100%;
    border-left: 0;

    &:before {
      top: -0.1em;
      left: 0;
      border-bottom: toRem(1) solid var(--border-primary-light);
      border-left: toRem(1) solid var(--border-primary-light);
      border-bottom-left-radius: 50%;
    }
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

.module-tree-item__name-text-wrapper {
  display: flex;
  align-items: center;
  gap: toRem(5);
}

.module-tree-item__name-text {
  max-width: toRem(300);
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
