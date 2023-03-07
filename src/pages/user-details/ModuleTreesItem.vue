<template>
  <ul class="module-tree-item__wrapper">
    <li class="module-tree-item">
      <app-button
        color="default"
        class="module-tree-item__name"
        :disabled="!item.deployable || isWasFound"
        @click="toggleTree"
      >
        <div class="module-tree-item__name-text" :title="branchName">
          {{ branchName }}
        </div>
        <icon
          v-if="item.deployable && !isWasFound"
          class="module-tree-item__name-icon"
          :class="{ 'module-tree-item__name-icon--open': isOpenTree }"
          :name="$icons.chevronFullDown"
        />
      </app-button>

      <div class="module-tree-item__date-wrapper">
        <span class="module-tree-item__date-text">
          {{ expirationDate }}
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
        v-if="item.username"
        class="module-tree-item__item-btn"
        color="error"
        :text="$t('module-tree-item.delete-btn')"
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
import { AppButton, Icon, PermissionModal, DeleteModal } from '@/common'
import { ErrorHandler, formatYMD } from '@/helpers'
import { UserPermissionInfo, UserMeta } from '@/types'
import { Bus } from '@/helpers'
import { useContext } from '@/composables'
import ModuleTreesItem from '@/pages/user-details/ModuleTreesItem.vue'
import { useAuthStore } from '@/store'

const FIRST_PAGE = 0
const PAGE_LIMIT = 10

const props = withDefaults(
  defineProps<{
    moduleName: string
    id: string
    item: UserPermissionInfo
    searchValue?: string
    isWasFound?: boolean
  }>(),
  { isWasFound: false, searchValue: '' },
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

const isPaginationButtonViewed = computed(
  () => pagesCount.value - 1 >= currentPage.value,
)

const branchName = computed(() =>
  props.isWasFound ? props.item.link : props.item.path,
)

const expirationDate = computed(() =>
  props.item.expires_at
    ? formatYMD(props.item.expires_at)
    : $t('module-tree-item.no-date-message'),
)

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
          userId: props.id,
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
    repeat(2, minmax(toRem(100), toRem(150)))
    toRem(100);
  gap: toRem(10);
  min-height: toRem(24);
}

.module-tree-item__name {
  max-width: 100%;
  white-space: nowrap;
  align-items: center;
  gap: toRem(4);

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

.module-tree-item__pagination-button {
  padding-top: toRem(4);
}
</style>
