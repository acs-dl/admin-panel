<template>
  <modal is-close-by-click-outside is-center @click-outside="closeModal">
    <div class="refresh-modal__inner">
      <div class="refresh-modal__header">
        <div class="refresh-modal__icon-wrapper">
          <icon class="refresh-modal__icon" :name="$icons.refresh" />
        </div>
        <h3 class="refresh-modal__title">
          {{ $t('refresh-modal.title') }}
        </h3>
        <h5 class="refresh-modal__subtitle">
          {{ $t('refresh-modal.subtitle') }}
        </h5>
      </div>
      <div class="refresh-modal__steps-wrapper">
        <refresh-modal-steps v-model:current-step="currentStep" />
      </div>
      <div class="refresh-modal__step-wrapper">
        <div class="refresh-modal">
          <template v-if="isLoaded">
            <error-message
              v-if="isLoadFailed"
              :message="$t('refresh-modal.error-message')"
            />
            <template v-else>
              <template v-if="!isRefreshAllStep">
                <div class="refresh-modal__field">
                  <h4 class="refresh-modal__field-title">
                    {{ $t('refresh-modal.module-title') }}
                  </h4>
                  <select-field
                    v-model="module"
                    class="refresh-modal__select"
                    scheme="secondary"
                    :value-options="moduleNamesForRefresh"
                    :placeholder="$t('refresh-modal.module-placeholder')"
                  />
                </div>
                <template v-if="isSubmoduleStep">
                  <div class="refresh-modal__field">
                    <h4 class="refresh-modal__field-title">
                      {{ $t('refresh-modal.submodule-title') }}
                    </h4>
                    <div class="refresh-modal__submodule-wrapper">
                      <div class="refresh-modal__submodule-input-wrapper">
                        <input-field
                          v-model="submoduleToSearch"
                          scheme="secondary"
                          :placeholder="
                            $t('refresh-modal.submodule-placeholder')
                          "
                          @keyup.enter="searchSubmodule"
                        />
                        <app-button
                          class="refresh-modal__search-submodule-button"
                          color="primary"
                          :text="$t('refresh-modal.add-submodule-button')"
                          :disabled="!submoduleToSearch"
                          @click="searchSubmodule"
                        />
                      </div>
                      <p
                        v-if="isSubmoduleInputError"
                        class="refresh-modal__submodule-input-error"
                      >
                        {{ submoduleErrorMessage }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="isSubmoduleLoaded"
                    class="refresh-modal__submodules-list"
                  >
                    <refresh-submodule-item
                      v-for="(item, idx) in submodules"
                      :key="idx"
                      class="refresh-modal__submodule-list-item"
                      :name="item"
                      @delete="deleteSubmodule"
                    />
                  </div>
                  <loader v-else />
                </template>
              </template>
              <refresh-estimate
                class="refresh-modal__estimate"
                :estimate="estimatedTime"
                :is-time-shown="isRefreshTimeShown"
              />
              <refresh-modal-actions
                :is-submit-disabled="isRefreshButtonDisabled"
                @cancel="closeModal"
                @submit="refresh"
              />
            </template>
          </template>
          <loader v-else />
        </div>
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import { SelectField, InputField } from '@/fields'
import { ErrorMessage, Loader, AppButton } from '@/common'
import {
  RefreshEstimate,
  RefreshModalActions,
  RefreshModalSteps,
  RefreshSubmoduleItem,
} from '@/common/modal/refresh-modal'
import { EstimatedTime } from '@/types'
import { ErrorHandler, Bus } from '@/helpers'
import { api } from '@/api'
import { computed, ref, watch } from 'vue'
import { Modal, Icon } from '@/common'
import { REFRESH_MODULE_STEPS } from '@/enums'
import { storeToRefs } from 'pinia'
import { useAuthStore, usePlatformStore } from '@/store'
import { useContext } from '@/composables'

enum REFRESH_ACTIONS {
  refreshModule = 'refresh_module',
  refreshSubmodule = 'refresh_submodule',
}

type IsSubmoduleExist = {
  is_exists: boolean
}

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { $t } = useContext()
const { currentUserId } = useAuthStore()
const { modules } = storeToRefs(usePlatformStore())
const isLoaded = ref(true)
const isLoadFailed = ref(false)
const isSubmoduleLoaded = ref(true)
const estimatedTime = ref('')
const currentStep = ref(REFRESH_MODULE_STEPS.all)
const submodules = ref<string[]>([])
const isSubmoduleValid = ref(true)
const isSuchSubmoduleExistError = ref(false)

const module = ref('')
const submoduleToSearch = ref('')

const currentModuleId = computed(
  () => modules.value.find(item => item.name === module.value)?.id,
)

const moduleNamesForRefresh = computed(() =>
  modules.value.map(item => item.name),
)

const isRefreshAllStep = computed(
  () => currentStep.value === REFRESH_MODULE_STEPS.all,
)

const isModuleStep = computed(
  () => currentStep.value === REFRESH_MODULE_STEPS.module,
)

const isSubmoduleStep = computed(
  () => currentStep.value === REFRESH_MODULE_STEPS.submodule,
)

const isModuleStepRefreshCanBeShown = computed(
  () => isModuleStep.value && Boolean(module.value),
)

const isSubmoduleStepRefreshCanBeShown = computed(
  () =>
    isSubmoduleStep.value &&
    Boolean(module.value) &&
    Boolean(submodules.value.length),
)

const submoduleName = computed(() =>
  submoduleToSearch.value.charAt(0) === '/'
    ? submoduleToSearch.value.slice(1)
    : submoduleToSearch.value,
)

const isRefreshButtonDisabled = computed(
  () =>
    (isSubmoduleStep.value && (!module.value || !submodules.value.length)) ||
    (isModuleStep.value && !module.value),
)

const isRefreshTimeCanBeLoaded = computed(
  () =>
    isRefreshAllStep.value ||
    isModuleStepRefreshCanBeShown.value ||
    isSubmoduleStepRefreshCanBeShown.value,
)

const submoduleErrorMessage = computed(() => {
  if (isSuchSubmoduleExistError.value) {
    return $t('refresh-modal.submodule-exist-error')
  }
  return module.value
    ? $t('refresh-modal.submodule-search-error')
    : $t('refresh-modal.submodule-clear-module-error')
})

const isRefreshTimeShown = computed(
  () => isRefreshTimeCanBeLoaded.value && Boolean(estimatedTime.value),
)

const isSubmoduleInputError = computed(
  () => isSuchSubmoduleExistError.value || !isSubmoduleValid.value,
)

const closeModal = () => {
  emit('close')
}

const deleteSubmodule = (submoduleName: string) => {
  submodules.value = submodules.value.filter(item => item !== submoduleName)
}

const loadEstimate = async () => {
  if (!isRefreshTimeCanBeLoaded.value) return
  const { data } = await api.post<EstimatedTime>(
    '/integrations/orchestrator/estimate_refresh',
    {
      data: {
        attributes: {
          ...(currentModuleId.value
            ? { module_name: currentModuleId.value }
            : {}),
          ...(submodules.value.length ? { submodule: submodules.value } : {}),
        },
      },
    },
  )
  estimatedTime.value = data.estimated_time
}

const checkIsSubmoduleLinkValid = async () => {
  const { data } = await api.get<IsSubmoduleExist>(
    '/integrations/orchestrator/submodule',
    {
      filter: {
        ...(currentModuleId.value
          ? { module_name: currentModuleId.value }
          : {}),
        ...(submoduleToSearch.value
          ? {
              submodule:
                submoduleToSearch.value.charAt(0) === '/'
                  ? submoduleToSearch.value.slice(1)
                  : submoduleToSearch.value,
            }
          : {}),
      },
    },
  )
  isSubmoduleValid.value = data.is_exists
}

const searchSubmodule = async () => {
  if (!submoduleName.value) return
  const isSubmoduleWithThisNameExist = submodules.value.some(
    item => item === submoduleName.value,
  )
  if (isSubmoduleWithThisNameExist) {
    isSuchSubmoduleExistError.value = true
    return
  }
  if (!module.value) {
    isSubmoduleValid.value = false
    return
  }
  isSubmoduleLoaded.value = false
  try {
    await checkIsSubmoduleLinkValid()
    if (isSubmoduleValid.value && submoduleName.value) {
      submodules.value.push(submoduleName.value)
      submoduleToSearch.value = ''
    }
  } catch (e) {
    isSubmoduleValid.value = false
    ErrorHandler.process(e)
  }
  isSubmoduleLoaded.value = true
}

const init = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    await loadEstimate()
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const refresh = async () => {
  isLoaded.value = false
  isLoadFailed.value = false

  const endpoint = module.value
    ? '/integrations/orchestrator/requests'
    : '/integrations/orchestrator/refresh'

  try {
    await api.post(endpoint, {
      data: {
        attributes: {
          ...(module.value ? { module: currentModuleId.value } : {}),
          ...(module.value
            ? {
                payload: {
                  action: submodules.value.length
                    ? REFRESH_ACTIONS.refreshSubmodule
                    : REFRESH_ACTIONS.refreshModule,
                  ...(submodules.value.length
                    ? { links: submodules.value }
                    : {}),
                },
              }
            : {}),
          from_user: currentUserId?.toString(),
          to_user: currentUserId?.toString(),
        },
      },
    })
    Bus.info($t('refresh-modal.success-sent-refresh'))
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

watch(currentStep, () => {
  estimatedTime.value = ''
  module.value = ''
})

watch(module, () => {
  submoduleToSearch.value = ''
  submodules.value = []
  isSubmoduleValid.value = true
})

watch(submoduleToSearch, () => {
  isSuchSubmoduleExistError.value = false
  isSubmoduleValid.value = true
})

watch(
  [currentStep, module, () => submodules.value.length],
  async () => {
    await init()
  },
  { immediate: true },
)
</script>

<style lang="scss" scoped>
.refresh-modal__inner {
  max-width: 80vh;
  min-height: toRem(345);

  @include respond-to(tablet) {
    max-width: 60vh;
  }
}

.refresh-modal__icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: toRem(48);
  height: toRem(48);
  border: toRem(1) solid var(--border-primary-light);
  border-radius: toRem(10);
  margin-bottom: toRem(12);
}

.refresh-modal__icon {
  width: toRem(19);
}

.refresh-modal__title {
  font-size: toRem(18);
  font-weight: 600;
  margin-bottom: toRem(10);
}

.refresh-modal__subtitle {
  font-weight: 400;
  font-size: toRem(14);
  color: var(--text-secondary-light);
}

.refresh-modal__steps-wrapper {
  margin: toRem(24) 0;
}

.refresh-modal__estimate {
  margin: toRem(24) 0;

  @include respond-to(tablet) {
    margin: toRem(12) 0;
  }
}

.refresh-modal__field-title {
  font-weight: 500;
  font-size: toRem(14);
  margin-bottom: toRem(6);
}

.refresh-modal__field {
  margin-top: toRem(24);

  @include respond-to(tablet) {
    margin-top: toRem(16);
  }
}

.refresh-modal__submodule-input-wrapper {
  display: flex;
  gap: toRem(15);

  @include respond-to(tablet) {
    flex-direction: column;
    align-items: center;
    gap: toRem(12);
  }
}

.refresh-modal__search-submodule-button {
  color: var(--primary-main);
  font-size: toRem(16);
  font-weight: 400;
}

.refresh-modal__submodule-list-item {
  margin-top: toRem(12);
}

.refresh-modal__submodules-list {
  max-height: toRem(210);
  overflow-y: auto;
}

.refresh-modal__submodule-input-error {
  font-size: toRem(12);
  color: var(--error-main);
}

.refresh-modal__select {
  &:deep(.select-field__select-dropdown) {
    max-height: toRem(200);
  }
}
</style>
