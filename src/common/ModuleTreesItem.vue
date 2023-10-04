<template>
  <ul class="module-tree-item__wrapper">
    <li class="module-tree-item">
      <app-button
        color="default"
        class="module-tree-item__name"
        :disabled="isTreeToggleDisabled"
        @click="toggleTree"
      >
        <icon
          v-if="item.deployable && !isWasFound"
          class="module-tree-item__name-icon"
          :class="{ 'module-tree-item__name-icon--open': isOpenTree }"
          :name="$icons.chevronFullDown"
        />
        <span class="module-tree-item__name-text" :title="branchName">
          {{ branchName }}
        </span>
      </app-button>

      <app-button
        v-if="item.access_level"
        class="module-tree-item__item-btn"
        color="blue"
        :disabled="isTelegramModule"
        :text="item.access_level?.name"
        @click="togglePermissionModal"
      />

      <app-button
        v-if="item.username"
        :class="[
          'module-tree-item__item-btn',
          'module-tree-item__item-btn--delete',
        ]"
        color="error"
        :text="$t('module-tree-item.delete-btn')"
        @click="toggleDeleteModal"
      />

      <app-button
        v-if="item.username"
        :class="[
          'module-tree-item__item-btn',
          'module-tree-item__item-btn--trash',
        ]"
        :icon-left="$icons.trash"
        @click="toggleDeleteModal"
      />
    </li>
    <li
      v-show="isOpenTree && !isWasFound"
      class="module-tree-item__children-wrapper"
    >
      <module-trees-item
        v-for="(child, index) in loadedTreeLevel"
        :key="index"
        :id="id"
        :module-name="moduleName"
        :item="child"
      />
      <template v-if="isPaginationButtonViewed">
        <ul class="module-tree-item__wrapper">
          <li class="module-tree-item">
            <app-button
              class="module-tree-item__pagination-button"
              color="default"
              :disabled="isProcessing"
              :icon-left="$icons.dotsHorizontal"
              @click="loadNextLevelTree"
            />
          </li>
        </ul>
      </template>
    </li>
    <transition-modal>
      <permission-modal
        v-if="isShownPermissionModal"
        :id="id"
        :module="item"
        :module-name="moduleName"
        @submit="reloadPermissionModal"
        @cancel="togglePermissionModal"
      />
    </transition-modal>

    <transition-modal>
      <delete-modal
        v-if="isShownDeleteModal"
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
    </transition-modal>
  </ul>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { api } from '@/api'
import { ErrorHandler } from '@/helpers'
import { UserPermissionInfo, UserMeta } from '@/types'
import { Bus } from '@/helpers'
import { useContext } from '@/composables'
import { useAuthStore } from '@/store'
import { MODULES } from '@/enums'
import { DeleteModal, PermissionModal, TransitionModal } from './modal'
import AppButton from './AppButton.vue'
import Icon from './Icon.vue'
import ModuleTreesItem from './ModuleTreesItem.vue'

const FIRST_PAGE = 0
const PAGE_LIMIT = 10

const props = withDefaults(
  defineProps<{
    moduleName: string
    item: UserPermissionInfo
    id?: string
    searchValue?: string
    isWasFound?: boolean
  }>(),
  { id: '', isWasFound: false, searchValue: '' },
)

const { $t } = useContext()
const { currentUserId } = useAuthStore()
const isProcessing = ref(false)
const loadedTreeLevel = ref<UserPermissionInfo[]>([])
const isShownDeleteModal = ref(false)
const isShownPermissionModal = ref(false)
const isOpenTree = ref(false)
const currentPage = ref(FIRST_PAGE)
const branchesCount = ref(0)

const pagesCount = computed(() => Math.ceil(branchesCount.value / PAGE_LIMIT))

const isTreeToggleDisabled = computed(
  () => !props.item.deployable || props.isWasFound || isProcessing.value,
)

const isPaginationButtonViewed = computed(
  () => pagesCount.value - 1 >= currentPage.value,
)

const branchName = computed(() =>
  props.isWasFound ? props.item.link : props.item.path,
)

const isTelegramModule = computed(() => props.moduleName === MODULES.telegram)

const loadNextLevelTree = async () => {
  isProcessing.value = true
  try {
    const { data, meta } = await api.get<UserPermissionInfo[], UserMeta>(
      `/integrations/${props.moduleName}/permissions`,
      {
        page: {
          limit: PAGE_LIMIT,
          number: currentPage.value,
        },
        filter: {
          ...(props.id && { userId: props.id }),
          username: props.item.username,
          parentLink: props.item.link,
        },
      },
    )
    branchesCount.value = meta.total_count
    loadedTreeLevel.value = loadedTreeLevel.value.concat(data)
    currentPage.value = currentPage.value + 1
  } catch (e) {
    ErrorHandler.process(e)
  }
  isProcessing.value = false
}

const toggleTree = async () => {
  if (!isOpenTree.value) await loadNextLevelTree()
  isOpenTree.value = !isOpenTree.value
}

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
          from_user: String(currentUserId),
          to_user: String(props.id),
          payload: {
            action: 'remove_user',
            user_id: String(props.id),
            link: props.item.link,
            username: props.item.username,
            ...(isTelegramModule.value
              ? {
                  ...(props.item?.submodule_access_hash
                    ? {
                        submodule_access_hash:
                          props.item?.submodule_access_hash,
                      }
                    : {}),
                  submodule_id: props.item?.submodule_id ?? null,
                }
              : {}),
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
  min-height: toRem(24);

  @include respond-to(tablet) {
    grid-template-columns:
      minmax(toRem(100), 1fr)
      toRem(75)
      toRem(15);
  }
}

.module-tree-item__name {
  max-width: 100%;
  white-space: nowrap;
  align-items: center;
  gap: toRem(4);
  justify-content: flex-start;

  &:disabled,
  &--disabled {
    cursor: default;
    pointer-events: auto;
    filter: none;
    opacity: 1;
  }
}

.module-tree-item__name-text {
  width: 100%;
  text-align: start;
  font-weight: 400;
  line-height: 1.2;

  @include text-ellipsis;

  @include respond-to(tablet) {
    font-size: toRem(12);
  }
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

  &--trash {
    display: none;
  }

  @include respond-to(tablet) {
    font-size: toRem(14);

    &--delete {
      display: none;
    }

    &--trash {
      width: 100%;
      color: var(--text-secondary-light);
      display: block;
    }
  }
}

.module-tree-item__pagination-button {
  padding-top: toRem(4);
}

.module-tree-item__date-wrapper {
  @include respond-to(tablet) {
    display: none;
  }
}
</style>
