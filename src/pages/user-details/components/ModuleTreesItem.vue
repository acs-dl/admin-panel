<template>
  <ul class="module-item__wrapper">
    <li class="module-item" :class="{ 'module-item--module': isModule }">
      <div v-if="!isModule"></div>
      <button class="module-item__name" @click="toggle">
        <span class="module-item__name-text">
          {{ item.path || item?.attributes?.path || moduleName }}
        </span>

        <icon
          v-if="isFolder"
          class="module-item__name-icon"
          :name="isOpen ? $icons.chevronUp : $icons.chevronDown"
        />
      </button>
      <div v-if="isModule">
        {{ $t('module-item.delete-btn') }}
      </div>
      <app-button
        class="module-item__item-btn"
        color="blue"
        :text="String(item.access_level || item?.attributes?.access_level)"
        @click="toggleCreateNewMemberModal"
      />
      <app-button
        class="module-item__item-btn"
        color="error"
        :text="$t('module-item.delete-btn')"
      />
    </li>
    <li v-if="isOpen" :class="{ 'module-item--right': isModule }">
      <module-trees-item
        v-for="(child, index) in children"
        :key="index"
        :id="id"
        :module-name="moduleName"
        :item="child"
      />
    </li>
    <permission-modal
      v-if="isShowCreateUserModal"
      :id="id"
      @sumbit="reloadCreateNewMemberModal"
      @cancel="toggleCreateNewMemberModal"
    />
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { api } from '@/api'
import { AppButton, Icon, PermissionModal } from '@/common'
import { ErrorHandler } from '@/helpers'
import ModuleTreesItem from './ModuleTreesItem.vue'

const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    item?: any // fix
    id: string
    moduleName: string
    isModuleLevel?: boolean
  }>(),
  {
    item: undefined,
    isModuleLevel: false,
  },
)
const isShowCreateUserModal = ref(false)
const isOpen = ref(false)
const children = ref()
const isModule = computed(() => props.isModuleLevel)
const isFolder = computed(
  () =>
    props.item.deployable ||
    props.item?.attributes?.deployable ||
    isModule.value,
)

const toggleCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = !isShowCreateUserModal.value
}

const reloadCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = false
}

const toggle = async () => {
  try {
    if (isFolder.value) {
      if (!isModule.value) {
        const { rawData } = await api.get(
          `/integrations/${props.moduleName}/permissions`,
          {
            filter: {
              userId: props.id,
              link: props.item?.attributes?.link ?? props.item.link,
            },
          },
        )
        children.value = rawData.data ?? []
      } else {
        children.value = props.item.children
      }
      isOpen.value = !isOpen.value
    }
  } catch (e) {
    ErrorHandler.processWithoutFeedback(e)
  }
}
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
