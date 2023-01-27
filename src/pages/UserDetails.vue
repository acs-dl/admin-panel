<template>
  <div class="user-details">
    <div class="user-details__title-wrapper">
      <h2 class="user-details__title">
        {{ mainTitle }}
      </h2>
      <app-button
        class="user-details__add-user-btn"
        size="medium"
        modification="border-rounded"
        scheme="filled"
        :text="$t('user-details.add-user-btn')"
        @click="toggleCreateNewMemberModal"
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
          <template v-if="modulesList.length">
            <module-info-list :id="id" :modules="modulesList" />
            <module-trees :id="id" :module-trees-list="moduleTreesList" />
          </template>
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

    <permission-modal
      v-if="isShowCreateUserModal"
      :id="id"
      @submit="reloadCreateNewMemberModal"
      @cancel="toggleCreateNewMemberModal"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import {
  Loader,
  ErrorMessage,
  NoDataMessage,
  PermissionModal,
  AppButton,
} from '@/common'
import { api } from '@/api'
import { ErrorHandler } from '@/helpers'
import { ModuleInfo, VerifiedUser } from '@/types'
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
const isLoaded = ref(true)
const isShowCreateUserModal = ref(false)
const modulesList = ref<ModuleInfo[]>([])
const moduleTreesList = ref<unknown[]>([]) // use type
const userDetails = ref<VerifiedUser | null>(null) // use type

const mainTitle = computed(() =>
  userDetails.value
    ? `${userDetails.value.name} ${userDetails.value.surname}`
    : $t('user-details.main-title'),
)
const getUser = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    const { data } = await api.get<VerifiedUser>(
      `/integrations/identity-svc/users/${props.id}`,
    )
    userDetails.value = data
  } catch (e) {
    isLoadFailed.value = true
    router.push({ name: ROUTE_NAMES.verifiedUsers })
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
    modulesList.value = data ?? []
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
      modulesList.value.map(async (item: ModuleInfo) => {
        const { data } = await api.get(
          `/integrations/${item.module}/permissions`,
          {
            filter: { userId: props.id, link: '' },
          },
        )
        return { children: data, type: item.module }
      }) ?? [],
    )
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const toggleCreateNewMemberModal = async () => {
  isShowCreateUserModal.value = !isShowCreateUserModal.value
}

const reloadCreateNewMemberModal = async () => {
  await loadInfo()
  isShowCreateUserModal.value = false
}

const loadInfo = async () => {
  await getUser()
  await getUserModules()
  await getModuleTreeList()
}

onMounted(async () => {
  await loadInfo()
})
</script>

<style scoped lang="scss">
.user-details__title {
  font-size: toRem(24);
  font-weight: 700;
}

.user-details__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-details__content {
  min-height: toRem(540);
}

.user-details__message {
  margin-top: toRem(50);
}
</style>
