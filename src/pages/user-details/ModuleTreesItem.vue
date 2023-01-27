<template>
  <ul class="module-item__wrapper">
    <li class="module-item" :class="{ 'module-item--module': isModule }">
      <div v-if="!isModule" class="module-item-border"></div>
      <div class="module-item__name">
        <app-button color="default" @click="toggle">
          <icon
            v-if="!isModule && isFolder"
            class="module-item__name-icon"
            :name="isOpen ? $icons.chevronUp : $icons.chevronDown"
          />
          <span class="module-item__name-text">
            {{ item.path || moduleName }}
          </span>
          <icon
            v-if="isModule"
            class="module-item__name-icon"
            :name="isOpen ? $icons.chevronUp : $icons.chevronDown"
          />
        </app-button>
      </div>

      <div v-if="isModule">
        {{ $t('module-item.submodule-column') }}
      </div>
      <div>
        <app-button
          v-if="item.access_level"
          class="module-item__item-btn"
          color="blue"
          :text="item.access_level?.name"
          @click="toggleCreateNewMemberModal"
        />
      </div>
      <div>
        <app-button
          class="module-item__item-btn"
          color="error"
          :text="$t('module-item.delete-btn')"
        />
      </div>
    </li>
    <li v-if="isOpen" :class="{ 'module-item--right': isModule }">
      <module-trees-item
        v-for="(child, index) in children"
        :key="index"
        :id="id"
        :module-name="moduleName"
        :item="child"
        :roles="rolesList"
      />
    </li>
    <permission-modal
      v-if="isShowCreateUserModal"
      :id="id"
      :module="item"
      :module-name="moduleName"
      @submit="reloadCreateNewMemberModal"
      @cancel="toggleCreateNewMemberModal"
    />
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'
import { AppButton, Icon, PermissionModal } from '@/common'
import { ErrorHandler } from '@/helpers'
import ModuleTreesItem from './ModuleTreesItem.vue'
import {
  ModulePermisonsResponse,
  ModulePermisons,
  UserPermisonInfo,
} from '@/types'

const props = withDefaults(
  defineProps<{
    id: string
    moduleName: string
    isModuleLevel?: boolean
    item?: UserPermisonInfo
    roles?: ModulePermisons[]
  }>(),
  {
    item: undefined,
    isModuleLevel: false,
    roles: undefined,
  },
)
const isShowCreateUserModal = ref(false)
const isOpen = ref(false)
const children = ref()
const isModule = computed(() => props.isModuleLevel)
const isFolder = computed(() => props.item.deployable || isModule.value)
const rolesList = ref<ModulePermisons[]>(props.roles)

const toggle = async () => {
  try {
    if (isFolder.value) {
      if (!isModule.value) {
        const { data } = await api.get(
          `/integrations/${props.moduleName}/permissions`,
          {
            filter: {
              userId: props.id,
              link: props.item.link,
            },
          },
        )
        children.value = data ?? []
      } else {
        children.value = props.item.children
      }
      isOpen.value = !isOpen.value
    }
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const getDesc = async () => {
  try {
    if (!isModule.value) return
    const { data } = await api.get<ModulePermisonsResponse>(
      `/integrations/${props.moduleName}/get_available_roles`,
      {
        filter: {
          link: props.item.children[0]?.link,
        },
      },
    )

    rolesList.value = data.list
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}

const toggleCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = !isShowCreateUserModal.value
}

const reloadCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = false
}

onMounted(async () => {
  await getDesc()
})
</script>

<style scoped lang="scss">
.module-item__wrapper {
  padding-left: 0.5em;
  line-height: 1.5em;
}

.module-item {
  display: grid;
  grid-template-columns:
    toRem(100)
    minmax(toRem(100), 1fr)
    repeat(2, toRem(100));
}

.module-item__name {
  display: flex;
  align-items: center;
  gap: toRem(8);
}

.module-item__name-text {
  font-weight: 400;
}

.module-item__name-icon {
  width: toRem(12);
  height: toRem(12);
}
</style>
