<template>
  <div class="user-details">
    <div class="user-details__title-wrapper">
      <h2 class="user-details__title">
        {{ mainTitle }}
      </h2>
      <app-button
        v-if="mainTitle"
        class="user-details__add-user-btn"
        size="medium"
        modification="border-rounded"
        scheme="filled"
        :text="$t('user-details.add-user-btn')"
        @click="togglePermissionModal"
      />
    </div>

    <div class="user-details__content">
      <template v-if="isLoaded">
        <template v-if="isLoadFailed">
          <error-message
            class="user-details__message"
            :message="$t('user-details.error-message')"
          />
        </template>
        <template v-else>
          <div v-if="modulesList?.length" class="user-details__content-wrapper">
            <!--TODO: DELETE OR EDIT AFTER DISCUSSION-->
            <module-info-list v-if="false" :id="id" :modules="modulesList" />
            <module-trees
              :id="id"
              :module-trees-list="moduleTreesList"
              @update-list="searchByModuleName($event)"
            />
          </div>
          <template v-else>
            <no-data-message
              class="user-details__message"
              :title="$t('user-details.no-data-title')"
              :message="$t('user-details.no-data-message')"
            />
          </template>
        </template>
      </template>
      <template v-else>
        <loader class="user-details__message" />
      </template>
    </div>

    <transition-modal>
      <permission-modal
        v-if="isShownPermissionModal"
        :id="id"
        @submit="reloadPermissionModal"
        @cancel="togglePermissionModal"
      />
    </transition-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  Loader,
  ErrorMessage,
  NoDataMessage,
  PermissionModal,
  AppButton,
  TransitionModal,
} from '@/common'
import { api } from '@/api'
import { ErrorHandler } from '@/helpers'
import {
  ModuleInfo,
  ModuleTree,
  UserModuleSearch,
  UserPermissionInfo,
  VerifiedUser,
} from '@/types'
import { useContext } from '@/composables'
import ModuleTrees from '@/pages/user-details/ModuleTrees.vue'
import ModuleInfoList from '@/pages/user-details/ModuleInfoList.vue'
import { router } from '@/router'
import { ROUTE_NAMES } from '@/enums'

const props = defineProps<{
  id: string
}>()

const { $t } = useContext()
const isLoadFailed = ref(false)
const isLoaded = ref(false)
const isShownPermissionModal = ref(false)
const modulesList = ref<ModuleInfo[]>([])
const moduleTreesList = ref<ModuleTree[]>([])
const userDetails = ref<VerifiedUser | null>(null)

const mainTitle = computed(() =>
  userDetails.value
    ? `${userDetails.value.name} ${userDetails.value.surname}`
    : '',
)

const getUser = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data } = await api.get<VerifiedUser>(
      `/integrations/identity-svc/users/${props.id}`,
    )
    userDetails.value = data
    await getUserModules()
  } catch (e) {
    isLoadFailed.value = true
    await router.push({ name: ROUTE_NAMES.verifiedUsers })
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const getUserModules = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data } = await api.get<ModuleInfo[]>(
      `/integrations/orchestrator/users/${props.id}`,
    )
    modulesList.value = data || []
    await getModuleTreeList()
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const getModuleTreeList = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    moduleTreesList.value = await Promise.all(
      modulesList.value?.map(async (item: ModuleInfo) => {
        const data = await getModulePermissions(item.module)
        return {
          children: data,
          isWasFound: false,
          type: item.module,
          id: props.id,
        }
      }) ?? [],
    )
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const getModulePermissions = async (moduleName: string, searchBy?: string) => {
  let res = [] as UserPermissionInfo[]
  try {
    const { data } = await api.get<UserPermissionInfo[]>(
      `/integrations/${moduleName}/permissions`,
      {
        filter: {
          userId: props.id,
          ...(searchBy ? { link: searchBy } : {}),
        },
      },
    )
    res = data
  } catch (e) {
    ErrorHandler.process(e)
  }
  return res
}

const searchByModuleName = async ({
  searchValue,
  moduleName,
}: UserModuleSearch) => {
  try {
    const foundModule = moduleTreesList.value.find(el => el.type === moduleName)
    if (foundModule) {
      foundModule.isWasFound = Boolean(searchValue)
      foundModule.children = await getModulePermissions(moduleName, searchValue)
    }
  } catch (e) {
    ErrorHandler.process(e)
  }
}

const togglePermissionModal = async () => {
  isShownPermissionModal.value = !isShownPermissionModal.value
}

const reloadPermissionModal = async () => {
  await getUser()
  isShownPermissionModal.value = false
}

getUser()
</script>

<style scoped lang="scss">
.user-details__title {
  line-height: 1.2;
  font-size: toRem(24);
  font-weight: 700;

  @include text-ellipsis;
}

.user-details__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: toRem(16);
  gap: toRem(15);
}

.user-details__content {
  min-height: toRem(540);
}

.user-details__content-wrapper {
  display: flex;
  gap: toRem(24);
  margin-bottom: toRem(65);

  @include respond-to(large) {
    flex-direction: column;
  }
}

.user-details__message {
  margin-top: toRem(50);
}

.user-details__add-user-btn {
  min-width: toRem(190);
}
</style>
