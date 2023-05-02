<template>
  <div class="verify-module-item">
    <img
      class="verify-module-item__icon"
      :src="moduleImage"
      :alt="currentModule"
    />
    <span
      class="verify-module-item__submodule"
      :class="{
        'verify-module-item__submodule--error': isSubmoduleLoadingError,
      }"
      :title="submoduleText"
    >
      {{ submoduleText }}
    </span>
    <div class="verify-module-item__buttons">
      <app-button
        class="verify-module-item__btn"
        color="blue"
        :text="$t('verify-module-item.verify-btn')"
        @click="emit('verify-module', currentModule)"
      />
      <app-button
        class="verify-module-item__btn"
        color="gray"
        :icon-left="$icons.trash"
        @click="emit('delete-module', currentModule)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { AppButton } from '@/common'
import { UnverifiedModuleUser } from '@/types'
import { storeToRefs } from 'pinia'
import { usePlatformStore } from '@/store'
import { api } from '@/api'
import { ErrorHandler } from '@/helpers'
import { useContext } from '@/composables'
import { MODULES } from '@/enums'

const props = defineProps<{
  currentModule: string
  user: UnverifiedModuleUser
}>()

const emit = defineEmits<{
  (e: 'verify-module', value: string): void
  (e: 'delete-module', value: string): void
}>()

const { $t, $filter } = useContext()
const { modules } = storeToRefs(usePlatformStore())
const submoduleName = ref('')
const isSubmoduleLoadingError = ref(false)

const moduleImage = computed(
  () => modules.value.find(item => item.id === props.currentModule)?.icon ?? '',
)

const isGitModules = computed(
  () =>
    props.currentModule === MODULES.github ||
    props.currentModule === MODULES.gitlab,
)

const submoduleText = computed(() => {
  if (isSubmoduleLoadingError.value) {
    return $t('verify-module-item.submodule-loading-error')
  }
  if (!submoduleName.value) {
    return $t('verify-module-item.no-submodule-info')
  }
  return submoduleName.value
})

const getModulePermissions = async () => {
  try {
    const { data } = await api.get<UnverifiedModuleUser>(
      '/integrations/unverified-svc/user',
      {
        filter: {
          module: props.currentModule,
          username: props.user.username,
        },
      },
    )
    if (!data?.submodule?.length) {
      return
    }
    submoduleName.value = isGitModules.value
      ? $filter.module(data?.submodule[0])
      : data?.submodule[0]
  } catch (e) {
    isSubmoduleLoadingError.value = true
    ErrorHandler.process(e)
  }
}
getModulePermissions()
</script>

<style lang="scss" scoped>
.verify-module-item {
  display: grid;
  grid-template-columns: toRem(100) minmax(toRem(100), 1fr) toRem(150);
  padding: toRem(16) 0;
  align-items: center;

  @include respond-to(medium) {
    grid-template-columns: toRem(75) minmax(toRem(100), 1fr) toRem(105);
  }
}

.verify-module-item__icon {
  max-width: toRem(32);
  margin-left: toRem(12);
}

.verify-module-item__buttons {
  display: flex;
  gap: toRem(50);
  justify-content: flex-end;
  align-items: center;

  @include respond-to(medium) {
    gap: toRem(10);
    justify-content: space-between;
  }
}

.verify-module-item__submodule {
  line-height: 1.2;
  color: var(--text-secondary-light);

  @include text-ellipsis;

  &--error {
    color: var(--error-main);
  }
}

.verify-module-item__btn {
  &:deep(.app-button__text) {
    font-weight: 400;
  }

  &:deep(.app-button__icon-left) {
    width: toRem(24);
    height: toRem(24);
  }

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}
</style>
