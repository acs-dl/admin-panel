<template>
  <div class="unverified-user-module-item">
    <app-button
      class="unverified-user-module-item__btn"
      :class="{ 'unverified-user-module-item__btn--open': isOpenTree }"
      :icon-right="$icons.chevronFullDown"
      :disabled="isProcessing"
      @click="onTreeBtnClick"
    >
      <img
        class="unverified-user-module-item__img"
        :src="moduleImageSrc"
        :alt="moduleName"
      />
    </app-button>
    <template v-if="isOpenTree && permissionsInfoList.length">
      <modules-trees-item
        v-for="(permissionInfo, index) in permissionsInfoList"
        :key="index"
        :item="permissionInfo"
        :module-name="moduleName"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { api } from '@/api'
import { AppButton } from '@/common'
import { ErrorHandler } from '@/helpers'
import { usePlatformStore } from '@/store'
import { UnverifiedModuleUser, UserPermissionInfo } from '@/types'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import ModulesTreesItem from '../user-details/ModuleTreesItem.vue'

const props = defineProps<{
  username: UnverifiedModuleUser['username']
  moduleName: string
}>()

const { modules } = storeToRefs(usePlatformStore())
const isOpenTree = ref(false)
const isProcessing = ref(false)
const permissionsInfoList = ref<UserPermissionInfo[]>([])

const moduleImageSrc = computed<string>(
  () =>
    modules.value.find(module => module.id === props.moduleName)?.icon || '',
)

const loadModulePermissions = async (): Promise<void> => {
  isProcessing.value = true
  try {
    const { data } = await api.get<UserPermissionInfo[]>(
      `/integrations/${props.moduleName}/permissions`,
      { filter: { username: props.username } },
    )

    permissionsInfoList.value = data
  } catch (e) {
    ErrorHandler.process(e)
    permissionsInfoList.value = []
  }
  isProcessing.value = false
}

const onTreeBtnClick = async (): Promise<void> => {
  if (!isOpenTree.value) await loadModulePermissions()
  isOpenTree.value = !isOpenTree.value
}
</script>

<style lang="scss" scoped>
.unverified-user-module-item__btn {
  gap: toRem(8);

  &[disabled] {
    filter: unset;
    opacity: unset;
  }

  :deep(.icon) {
    color: var(--text-primary-main);
    transition: linear 0.1s;
    height: toRem(10);
    width: toRem(10);
  }

  &--open {
    :deep(.icon) {
      transform: rotate(-180deg);
    }
  }
}

.unverified-user-module-item__img {
  width: toRem(24);
  height: toRem(24);
  border-radius: 50%;
}
</style>
