<template>
  <ul class="module-item__wrapper">
    <li class="module-item">
      <app-button color="default" class="module-item__name" @click="toggle">
        <div class="module-item__name-text">
          {{ item?.path }}
        </div>
        <icon
          v-if="isFolder"
          class="module-item__name-icon"
          :class="{ 'module-item__name-icon--open': isOpen }"
          :name="$icons.chevronFullDown"
        />
      </app-button>

      <app-button
        v-if="item.access_level"
        class="module-item__item-btn"
        color="blue"
        :text="item.access_level?.name"
        @click="toggleCreateNewMemberModal"
      />

      <app-button
        class="module-item__item-btn"
        color="error"
        :text="$t('module-item.delete-btn')"
        @click="toggleRemoveModal"
      />
    </li>
    <template v-if="isOpen">
      <module-trees-item
        v-for="(child, index) in children"
        :key="index"
        :id="id"
        :module-name="moduleName"
        :item="child"
      />
    </template>
    <permission-modal
      v-if="isShowCreateUserModal"
      :id="id"
      :module="item"
      :module-name="moduleName"
      @submit="reloadCreateNewMemberModal"
      @cancel="toggleCreateNewMemberModal"
    />
    <delete-modal
      v-if="isOpenRemoveModal"
      :icon="$icons.trash"
      @cancel="toggleRemoveModal"
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
const isOpenRemoveModal = ref(false)
const isShowCreateUserModal = ref(false)
const isOpen = ref(false)
const children = ref<UserPermisonInfo[]>([])
const isFolder = computed(() => props.item.deployable)

const toggle = async () => {
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
    isOpen.value = !isOpen.value
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const toggleCreateNewMemberModal = () => {
  isShowCreateUserModal.value = !isShowCreateUserModal.value
}

const reloadCreateNewMemberModal = () => {
  isShowCreateUserModal.value = false
}

const toggleRemoveModal = () => {
  isOpenRemoveModal.value = !isOpenRemoveModal.value
}

const deleteUserFromModule = async () => {
  try {
    await api.post('/integrations/orchestrator/requests', {
      data: {
        attributes: {
          module: props.moduleName,
          payload: {
            action: 'remove_user',
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
    Bus.success($t('module-info-item.success-delete'))
    isOpenRemoveModal.value = false
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
</script>

<style scoped lang="scss">
.module-item__wrapper {
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

.module-item {
  display: grid;
  grid-template-columns:
    minmax(toRem(100), 1fr)
    minmax(toRem(100), toRem(150))
    toRem(100);
  gap: toRem(10);
}

.module-item__name {
  white-space: nowrap;
  align-items: center;
  gap: toRem(4);
}

.module-item__name-text {
  max-width: toRem(200);
  text-align: start;
  font-weight: 400;
  line-height: 1.2;

  @include text-ellipsis;
}

.module-item__name-icon {
  width: toRem(10);
  height: toRem(10);
  transition: linear 0.1s;
  transform: rotate(-90deg);
  color: var(--text-primary-light);

  &--open {
    transform: rotate(0);
  }
}

.module-item__item-btn {
  font-weight: 400;
}
</style>
